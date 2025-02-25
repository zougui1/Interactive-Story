import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import { fromError } from 'zod-validation-error';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import type { Stat, Story } from '@zougui/interactive-story.story';

import { createAppSlice, type AppThunk } from '@renderer/store';

import { createDefaultStoryData } from './defaultStoryData';
import { getErrorMessage } from '@renderer/utils';
import { ToastMessage } from '@renderer/components/ToastMessage';
import { PayloadAction } from '@reduxjs/toolkit';

export interface StorySlice {
  syntheticKey: string;
  data: Story;
  filePath?: string;
}

const initialState: StorySlice = {
  syntheticKey: nanoid(),
  data: createDefaultStoryData(),
};

// TODO replace redux with xstate
//! replace redux with xstate

export const storySlice = createAppSlice({
  name: 'story',
  initialState,
  reducers: (create) => ({
    newStory: create.asyncThunk(
      async () => await Electron.request(electronApi.window.title.reset, {}),
      {
        pending: (state) => {
          state.syntheticKey = nanoid();
          state.data = createDefaultStoryData();
          state.filePath = undefined;
        },
      }
    ),

    updateStory: create.asyncThunk(
      async (story: Story) => {
        await Electron.request(electronApi.window.title.set, { title: story.title });
      },
      {
        pending: (state, action) => {
          state.data = action.meta.arg;
        },
      },
    ),

    openStory: create.asyncThunk(
      async () => {
        try {
          const { data } = await Electron.request(electronApi.fs.openFile, {});
          return data;
        } catch (error) {
          toast.error(<ToastMessage label="The file could not be opened." />);
          throw error;
        }
      },
      {
        fulfilled: (state, action) => {
          if (!action.payload?.story) {
            return;
          }

          state.syntheticKey = nanoid();
          state.data = action.payload.story;
          state.filePath = action.payload.filePath;
        },
      }
    ),

    updateStat: (state, action: PayloadAction<Stat>) => {
      state.data.stats[action.payload.id] = action.payload;
      state.data.statReferences[action.payload.id] ??= { count: 0 };
    },
  }),
});

export const { updateStory, openStory, newStory, updateStat } = storySlice.actions;

export const saveStory = (options?: SaveOptions): AppThunk => {
  return async (_dispatch, getState) => {
    const state = getState();
    const { data: story, filePath } = state.story;

    try {
      await Electron.request(electronApi.fs.save, {
        story,
        filePath: options?.overwrite ? filePath : undefined,
      });
    } catch (error) {
      console.log(error, fromError(error).toString())
      toast.error(
        <ToastMessage
          label="The file could not be saved."
          details={getErrorMessage(error) || fromError(error).message}
        />
      );
      throw error;
    }
  };
};

export interface SaveOptions {
  overwrite?: boolean;
}

export const exportHtml = (): AppThunk => {
  return async (_dispatch, getState) => {
    const state = getState();
    const { data: story, filePath } = state.story;

    const htmlFilePath = filePath
      ? `${filePath.split('.').slice(0, -1).join('.')}.html`
      : undefined;

    try {
      await Electron.request(electronApi.fs.export.html, {
        story,
        filePath: htmlFilePath,
      });
    } catch (error) {
      console.log(error, fromError(error).toString())
      toast.error(
        <ToastMessage
          label="The file could not be exported as HTML."
          details={getErrorMessage(error) || fromError(error).message}
        />
      );
      throw error;
    }
  };
};
