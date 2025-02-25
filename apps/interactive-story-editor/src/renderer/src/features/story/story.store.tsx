import { createStore } from '@xstate/store';
import { nanoid } from 'nanoid';
import { produce } from 'immer';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { Stat, type Story } from '@zougui/interactive-story.story';

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
    newStory: (context, event, enq) => {
      enq.effect(async () => {
        await Electron.request(electronApi.window.title.reset, {});
      });

      return getContext();
    },

    setStory: (context, { data, filePath }: { data: Story, filePath?: string }) => {
      return {
        syntheticKey: nanoid(),
        data,
        filePath,
      };
    },

    openStory: (context, event, enq) => {
      enq.effect(async () => {
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

    updateStory: (context, { story }: { story: Story }, enq) => {
      enq.effect(async () => {
        await Electron.request(electronApi.window.title.set, { title: story.title });
      });

      return {
        ...context,
        story,
      };
    },

    saveStory: (context, event: { overwrite?: boolean }, enq) => {
      enq.effect(async () => {
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

    exportHtml: (context, event, enq) => {
      enq.effect(async () => {
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
  },
});
