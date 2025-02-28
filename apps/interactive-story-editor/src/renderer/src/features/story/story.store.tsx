import { createStore } from '@xstate/store';
import { nanoid } from 'nanoid';
import { produce } from 'immer';
import { toast } from 'react-toastify';
import { fromError } from 'zod-validation-error';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { SceneChoice, SceneChoiceTarget, SceneChoiceTargetType, Stat, type Story } from '@zougui/interactive-story.story';

import { getErrorMessage } from '@renderer/utils';
import { ToastMessage } from '@renderer/components/ToastMessage';

import { createDefaultStoryData } from './defaultStoryData';
import { failEffectTypes } from './components/stat/StatCheckDialog';

export type TargetType = 'success' | 'fail';

export interface StoryStore {
  syntheticKey: string;
  data: Story;
  filePath?: string;
}

const getContext = (): StoryStore => {
  return {
    syntheticKey: nanoid(),
    data: createDefaultStoryData(),
    filePath: undefined,
  };
}

export const storyStore = createStore({
  context: getContext(),

  on: {
    newStory: () => {
      return getContext();
    },

    setStory: (_context, { data, filePath }: { data: Story, filePath?: string }) => {
      return {
        syntheticKey: nanoid(),
        data,
        filePath,
      };
    },

    openStory: (context, _event, enqueue) => {
      enqueue.effect(async () => {
        try {
          const { data } = await Electron.request(electronApi.fs.openFile, {});

          if (data) {
            storyStore.trigger.setStory({
              data: data.story,
              filePath: data.filePath,
            });
          }
        } catch (error) {
          toast.error(<ToastMessage label="The file could not be opened." />);
          throw error;
        }
      });

      return context;
    },

    updateTitle: (context, event: { title: string; }) => {
      return {
        ...context,
        data: {
          ...context.data,
          title: event.title,
        },
      };
    },

    updateSceneText: (context, event: { id: string; text: string; }) => {
      if (!context.data.scenes[event.id]) {
        return context;
      }

      return produce(context, draft => {
        draft.data.scenes[event.id].text = event.text;
      });
    },

    updateChoiceText: (context, event: { id: string; text: string; }) => {
      if (!context.data.choices[event.id]) {
        return context;
      }

      return produce(context, draft => {
        draft.data.choices[event.id].text = event.text;
      });
    },

    addChoice: (context, event: { sceneId: string }) => {
      if (!context.data.scenes[event.sceneId]) {
        return context;
      }

      return produce(context, draft => {
        const newScene = {
          id: nanoid(),
          text: '',
        };

        const newTarget = {
          targetId: nanoid(),
          targetType: 'success',
          type: SceneChoiceTargetType.Branch,
          sceneId: newScene.id,
        } satisfies SceneChoiceTarget;

        const newChoice = {
          id: nanoid(),
          text: '',
          targets: {
            success: {
              [newTarget.targetId]: newTarget,
            },
          },
        } satisfies SceneChoice;

        draft.data.sceneReferences[newScene.id] = { count: 1 };
        draft.data.choices[newChoice.id] = newChoice;
        draft.data.scenes[newScene.id] = newScene;
        draft.data.scenes[event.sceneId].choices ??= [];
        draft.data.scenes[event.sceneId].choices?.push(newChoice.id);
      });
    },

    addChoiceTarget: (context, event: { choiceId: string; targetType: TargetType; }) => {
      const currentChoice = context.data.choices[event.choiceId];
      const currentChoiceTargetGroup = currentChoice.targets[event.targetType];

      if (!currentChoiceTargetGroup) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTargetGroup = draftChoice.targets[event.targetType];

        if(!draftTargetGroup) {
          return;
        }

        const newScene = {
          id: nanoid(),
          text: '',
        };

        const newTarget = {
          targetId: nanoid(),
          targetType: event.targetType,
          type: SceneChoiceTargetType.Branch,
          sceneId: newScene.id,
        } satisfies SceneChoiceTarget;

        draft.data.scenes[newScene.id] = newScene;
        draft.data.sceneReferences[newScene.id] = { count: 1 };
        draftTargetGroup[newTarget.targetId] = newTarget;
      });
    },

    setChoiceJump: (context, event: { choiceId: string; targetType: TargetType; targetId: string; sceneId: string }) => {
      const currentChoice = context.data.choices[event.choiceId];
      const currentChoiceTarget = currentChoice.targets[event.targetType]?.[event.targetId];

      if (!currentChoiceTarget || currentChoiceTarget.sceneId === event.sceneId) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTarget = draftChoice.targets[event.targetType]?.[event.targetId];

        if(!draftTarget) {
          return;
        }

        draftTarget.type = SceneChoiceTargetType.Jump;
        draftTarget.sceneId = event.sceneId;

        const draftPrevSceneReference = draft.data.sceneReferences[currentChoiceTarget.sceneId];
        const draftNextSceneReference = draft.data.sceneReferences[event.sceneId];

        draftPrevSceneReference.count--;
        draftNextSceneReference.count++;

        if (draftPrevSceneReference.count <= 0) {
          delete draft.data.sceneReferences[currentChoiceTarget.sceneId];
          delete draft.data.scenes[currentChoiceTarget.sceneId];
        }
      });
    },

    setChoiceBranch: (context, event: { choiceId: string; targetType: TargetType; targetId: string; }) => {
      const currentChoice = context.data.choices[event.choiceId];
      const currentChoiceTarget = currentChoice.targets[event.targetType]?.[event.targetId];

      if (!currentChoiceTarget) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTarget = draftChoice.targets[event.targetType]?.[event.targetId];

        if(!draftTarget) {
          return;
        }

        const newScene = {
          id: nanoid(),
          text: '',
        };

        draft.data.scenes[newScene.id] = newScene;

        draftTarget.type = SceneChoiceTargetType.Branch;
        draftTarget.sceneId = newScene.id;

        const draftPrevSceneReference = draft.data.sceneReferences[currentChoiceTarget.sceneId];
        draft.data.sceneReferences[newScene.id] = { count: 1 };

        draftPrevSceneReference.count--;

        if (draftPrevSceneReference.count <= 0) {
          delete draft.data.sceneReferences[currentChoiceTarget.sceneId];
          delete draft.data.scenes[currentChoiceTarget.sceneId];
        }
      });
    },

    deleteChoice: (context, event: { id: string; }) => {
      if (!context.data.choices[event.id]) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.id];

        const targets = [
          ...Object.values(draftChoice.targets.success ?? {}),
          ...Object.values(draftChoice.targets.fail ?? {}),
        ];

        for (const target of targets) {
          const sceneReference = draft.data.sceneReferences[target.sceneId];
          sceneReference.count--;

          if (sceneReference.count <= 0) {
            delete draft.data.sceneReferences[target.sceneId];
            delete draft.data.scenes[target.sceneId];
          }
        }

        delete draft.data.choices[event.id];
      });
    },

    deleteChoiceTarget: (context, event: { choiceId: string; targetType: TargetType; targetId: string; }) => {
      if (!context.data.choices[event.choiceId]?.targets[event.targetType]?.[event.targetId]) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTargetGroup = draftChoice.targets[event.targetType];
        const draftTarget = draftTargetGroup?.[event.targetId];

        if (!draftTargetGroup || !draftTarget) {
          return;
        }

        const sceneReference = draft.data.sceneReferences[draftTarget.sceneId];
        sceneReference.count--;

        if (sceneReference.count <= 0) {
          delete draft.data.sceneReferences[draftTarget.sceneId];
          delete draft.data.scenes[draftTarget.sceneId];
        }

        delete draftTargetGroup[event.targetId];
      });
    },

    saveStory: (context, event: { overwrite?: boolean }, enqueue) => {
      enqueue.effect(async () => {
        try {
          await Electron.request(electronApi.fs.save, {
            story: context.data,
            filePath: event.overwrite ? context.filePath : undefined,
          });
        } catch (error) {
          console.log(error, fromError(error).toString());
          toast.error(
            <ToastMessage
              label="The file could not be saved."
              details={getErrorMessage(error) || fromError(error).message}
            />
          );
          throw error;
        }
      });

      return context;
    },

    exportHtml: (context, _event, enqueue) => {
      enqueue.effect(async () => {
        const htmlFilePath = context.filePath
          ? `${context.filePath.split('.').slice(0, -1).join('.')}.html`
          : undefined;

        try {
          await Electron.request(electronApi.fs.export.html, {
            story: context.data,
            filePath: htmlFilePath,
          });
        } catch (error) {
          console.log(error, fromError(error).toString());
          toast.error(
            <ToastMessage
              label="The file could not be exported as HTML."
              details={getErrorMessage(error) || fromError(error).message}
            />
          );
          throw error;
        }
      });

      return context;
    },

    updateStat: (context, event: { stat: Stat }) => {
      return produce(context, draft => {
        draft.data.stats[event.stat.id] = event.stat;
        draft.data.statReferences[event.stat.id] ??= { count: 0 };
      });
    },

    updateChoiceStatCheck: (context, event: NonNullable<SceneChoice['check']> & { choiceId: string }) => {
      const { choiceId, failEffect, stats } = event;
      const currentChoice = context.data.choices[choiceId];

      if (!currentChoice) {
        return;
      }

      return produce(context, draft => {
        const newScene = {
          id: nanoid(),
          text: '',
        };

        if (failEffect === failEffectTypes.branch && !Object.keys(currentChoice.targets.fail ?? {}).length) {
          const newFailTarget = {
            targetId: nanoid(),
            targetType: 'fail',
            sceneId: newScene.id,
            type: SceneChoiceTargetType.Branch,
          } satisfies SceneChoiceTarget;

          draft.data.scenes[newScene.id] = newScene;
          draft.data.sceneReferences[newScene.id] = { count: 1 };
          draft.data.choices[choiceId].targets.fail ??= {};
          draft.data.choices[choiceId].targets.fail[newFailTarget.targetId] = newFailTarget;
        }

        draft.data.choices[choiceId].check = { stats, failEffect };
      });
    },

    removeChoiceStatCheck: (context, event: { choiceId: string }) => {
      const { choiceId } = event;
      const currentChoice = context.data.choices[choiceId];

      if (!currentChoice) {
        return;
      }

      return produce(context, draft => {
        const choice = draft.data.choices[choiceId];

        for (const target of Object.values(choice.targets.fail ?? {})) {
          if (target) {
            draft.data.sceneReferences[target.sceneId].count--;

            if (draft.data.sceneReferences[target.sceneId].count <= 0) {
              delete draft.data.sceneReferences[target.sceneId];
              delete draft.data.scenes[target.sceneId];
            }
          }
        }


        choice.check = undefined;
        choice.targets.fail = undefined;
      });
    },

    updateChoiceTargetStatIncrements: (context, event: { choiceId: string; targetType: TargetType; targetId: string; statIncrements: SceneChoiceTarget['statIncrements']; }) => {
      const { choiceId, targetType, targetId, statIncrements } = event;

      const currentChoice = context.data.choices[choiceId];
      const currentChoiceTarget = currentChoice.targets[targetType]?.[targetId];

      if (!currentChoiceTarget) {
        return context;
      }

      return produce(context, draft => {
        for (const _id of Object.keys(statIncrements ?? {})) {
          // TODO update stat references
          //const statReference = draft.data.statReferences[id];
          const increments = { ...statIncrements };

          for (const statId of Object.keys(increments)) {
            if (!increments[statId]) {
              delete increments[statId];
            }
          }

          if (draft.data.choices[choiceId].targets[targetType]?.[targetId]) {
            draft.data.choices[choiceId].targets[targetType][targetId].statIncrements = increments;
          }
        }
      });
    },
  },
});

storyStore.select(state => state.data.title).subscribe(async title => {
  if (title.trim()) {
    await Electron.request(electronApi.window.title.set, { title });
  } else {
    await Electron.request(electronApi.window.title.reset, {});
  }
});
