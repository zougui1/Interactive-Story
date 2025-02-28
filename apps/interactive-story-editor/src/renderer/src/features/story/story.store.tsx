import { createStore } from '@xstate/store';
import { nanoid } from 'nanoid';
import { produce } from 'immer';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { SceneChoice, SceneChoiceTarget, SceneChoiceTargetType, Stat, type Story } from '@zougui/interactive-story.story';

import { createDefaultStoryData } from './defaultStoryData';
import { toast } from 'react-toastify';
import { ToastMessage } from '@renderer/components/ToastMessage';
import { fromError } from 'zod-validation-error';
import { getErrorMessage } from '@renderer/utils';
import { failEffectTypes } from './components/stat/StatCheckDialog';

const isTargetId = (value: string): value is 'success' | 'fail' => {
  return value === 'success' || value === 'fail';
}

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

        const newChoice = {
          id: nanoid(),
          text: '',
          targets: {
            success: {
              id: 'success',
              type: SceneChoiceTargetType.Branch,
              sceneId: newScene.id,
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

    setChoiceJump: (context, event: { choiceId: string; targetId: string; sceneId: string }) => {
      if (!isTargetId(event.targetId)) {
        return context;
      }

      const currentChoice = context.data.choices[event.choiceId];
      const currentChoiceTarget = currentChoice.targets[event.targetId];

      if (!currentChoiceTarget || currentChoiceTarget.sceneId === event.sceneId) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTarget = draftChoice.targets[event.targetId];

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

    setChoiceBranch: (context, event: { choiceId: string; targetId: string; }) => {
      if (!isTargetId(event.targetId)) {
        return context;
      }

      const currentChoice = context.data.choices[event.choiceId];
      const currentChoiceTarget = currentChoice.targets[event.targetId];

      if (!currentChoiceTarget) {
        return context;
      }

      return produce(context, draft => {
        const draftChoice = draft.data.choices[event.choiceId];
        const draftTarget = draftChoice.targets[event.targetId];

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
        const draftSuccessTarget = draftChoice.targets.success;
        const draftFailTarget = draftChoice.targets.fail;

        const successSceneReference = draft.data.sceneReferences[draftSuccessTarget.sceneId];
        const failSceneReference = draftFailTarget && draft.data.sceneReferences[draftFailTarget.sceneId];

        successSceneReference.count--;

        if (failSceneReference) {
          successSceneReference.count--;
        }

        if (successSceneReference.count <= 0) {
          delete draft.data.sceneReferences[draftSuccessTarget.sceneId];
          delete draft.data.scenes[draftSuccessTarget.sceneId];
        }

        if (failSceneReference && failSceneReference.count <= 0) {
          delete draft.data.sceneReferences[draftFailTarget.sceneId];
          delete draft.data.scenes[draftFailTarget.sceneId];
        }

        delete draft.data.choices[event.id];
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
        const branchNewScene = failEffect === failEffectTypes.branch && !currentChoice.targets.fail;
        const newScene = {
          id: nanoid(),
          text: '',
        };

        const newFailTarget = {
          id: 'fail',
          sceneId: newScene.id,
          type: SceneChoiceTargetType.Branch,
        } satisfies SceneChoiceTarget;

        if (branchNewScene) {
          draft.data.scenes[newScene.id] = newScene;
          draft.data.sceneReferences[newScene.id] = { count: 1 };
          draft.data.choices[choiceId].targets.fail = newFailTarget;
        }

        if (currentChoice.targets.fail) {
          draft.data.sceneReferences[currentChoice.targets.fail.sceneId].count--;

          if (draft.data.sceneReferences[currentChoice.targets.fail.sceneId].count <= 0) {
            delete draft.data.sceneReferences[currentChoice.targets.fail.sceneId];
            delete draft.data.scenes[currentChoice.targets.fail.sceneId];
          }
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
        const failTarget = choice.targets.fail;

        if (failTarget) {
          draft.data.sceneReferences[failTarget.sceneId].count--;

          if (draft.data.sceneReferences[failTarget.sceneId].count <= 0) {
            delete draft.data.sceneReferences[failTarget.sceneId];
            delete draft.data.scenes[failTarget.sceneId];
          }
        }

        choice.check = undefined;
        choice.targets.fail = undefined;
      });
    },

    updateChoiceTargetStatIncrements: (context, event: { choiceId: string; targetId: string; statIncrements: SceneChoiceTarget['statIncrements']; }) => {
      const { choiceId, targetId, statIncrements } = event;

      if (!isTargetId(targetId)) {
        return context;
      }

      const currentChoice = context.data.choices[choiceId];
      const currentChoiceTarget = currentChoice.targets[targetId];

      if (!currentChoiceTarget) {
        return context;
      }

      return produce(context, draft => {
        for (const id of Object.keys(statIncrements ?? {})) {
          // TODO update stat references
          //const statReference = draft.data.statReferences[id];
          const increments = { ...statIncrements };

          for (const statId of Object.keys(increments)) {
            if (!increments[statId]) {
              delete increments[statId];
            }
          }

          if (draft.data.choices[choiceId].targets[targetId]) {
            draft.data.choices[choiceId].targets[targetId].statIncrements = increments;
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
