import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { clamp } from '@zougui/common.math-utils';
import type { Story } from '@zougui/interactive-story.story';

import { createAppSlice } from '@renderer/store';

import { ToastMessage } from '@renderer/components/ToastMessage';

export interface StorySettings {
  fadingText: boolean;
  /**
   * zoom percentage (100 = 100% = default zoom)
   */
  zoom: number;
}

export interface StorySlice {
  syntheticKey: string;
  settings: StorySettings;
  data?: Story;
  filePath?: string;
}

const initialState: StorySlice = {
  syntheticKey: nanoid(),
  settings: {
    zoom: 100,
    fadingText: true,
  },
};

export const storySlice = createAppSlice({
  name: 'story',
  initialState,
  reducers: (create) => ({
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

    resetZoom: create.reducer((state) => {
      state.settings.zoom = initialState.settings.zoom;
    }),

    changeZoom: create.reducer((state, action: PayloadAction<'in' | 'out'>) => {
      const newZoom = action.payload === 'out' ? state.settings.zoom - 10 : state.settings.zoom + 10;
      state.settings.zoom = clamp(newZoom, 30, 500);
    }),

    changeFadingText: create.reducer((state, action: PayloadAction<boolean>) => {
      state.settings.fadingText = action.payload;
    }),
  }),
});

export const { openStory, resetZoom, changeZoom, changeFadingText } = storySlice.actions;
