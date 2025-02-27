import { createStore } from '@xstate/store';
import { nanoid } from 'nanoid';
import { produce } from 'immer';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { SceneChoice, SceneChoiceTarget, Stat, type Story } from '@zougui/interactive-story.story';

import { createDefaultStoryData } from './defaultStoryData';
import { toast } from 'react-toastify';
import { ToastMessage } from '@renderer/components/ToastMessage';
import { fromError } from 'zod-validation-error';
import { getErrorMessage } from '@renderer/utils';

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

    updateStory: (context, { story }: { story: Story }) => {
      return {
        ...context,
        data: story,
      };
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

      return produce(context, draft => {
        const choice = draft.data.choices[choiceId];

        choice.check = {
          stats,
          failEffect,
        };

        for (const id of Object.keys(stats)) {
          const statReference = draft.data.statReferences[id];

          // TODO increment the count only if the stat was not checked before
          if (statReference) {
            statReference.count++;
          }
        }
      });
    },

    removeChoiceStatCheck: (context, event: { choiceId: string }) => {
      const { choiceId } = event;

      return produce(context, draft => {
        const choice = draft.data.choices[choiceId];

        choice.check = undefined
        // TODO decrement the count for previously referenced stats
      });
    },

    updateChoiceTargetStatIncrements: (context, event: { choiceId: string; targetId: string; statIncrements: SceneChoiceTarget['statIncrements']; }) => {
      const { statIncrements } = event;

      return produce(context, draft => {
        for (const id of Object.keys(statIncrements ?? {})) {
          const statReference = draft.data.statReferences[id];

          // TODO increment the count only if the stat was not incremented before
          if (statReference) {
            statReference.count++;
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
