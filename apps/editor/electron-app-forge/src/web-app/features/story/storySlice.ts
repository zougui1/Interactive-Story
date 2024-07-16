import { nanoid } from 'nanoid';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import type { Story } from '@zougui/interactive-story.story';

import { createDefaultStoryData } from './defaultStoryData';
import { AppThunk, createAppSlice } from '../../store/createAppSlice';

export interface StorySlice {
  syntheticKey: string;
  data: Story;
  filePath?: string;
}

const initialState: StorySlice = {
  syntheticKey: nanoid(),
  data: createDefaultStoryData(),
};

export const storySlice = createAppSlice({
  name: 'story',
  initialState,
  reducers: create => ({
    newStory: create.asyncThunk(
      async () => await Electron.request(electronApi.window.titleReset, {}),
      {
        pending: state => {
          state.syntheticKey = nanoid();
          state.data = createDefaultStoryData();
          state.filePath = undefined;
        },
      },
    ),

    updateStory: create.reducer((state, action: PayloadAction<Story>) => {
      state.data = action.payload;
    }),

    openStory: create.asyncThunk(
      async () => {
        const { data } = await Electron.request(electronApi.fs.openFile, {});
        return data;
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
      },
    ),
  }),
});

export const {
  updateStory,
  openStory,
  newStory,
} = storySlice.actions;

export const saveStory = (options?: SaveOptions): AppThunk => async (_dispatch, getState) => {
  const state = getState();
  const { data: story, filePath } = state.story;

  await Electron.request(electronApi.fs.save, {
    story,
    filePath: options?.overwrite ? filePath : undefined,
  });
}

export interface SaveOptions {
  overwrite?: boolean;
}
