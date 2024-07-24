import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import { clamp } from '@zougui/common.math-utils';
import type { Story } from '@zougui/interactive-story.story';

import { createAppSlice } from '@renderer/store';

import { ToastMessage } from '@renderer/components/ToastMessage';

const zoomKey = 'story-zoom';

export interface StorySlice {
  syntheticKey: string;
  /**
   * zoom percentage (100 = 100% = default zoom)
   */
  zoom: number;
  data?: Story;
  filePath?: string;
}

const defaultZoom = 100;

const initialState: StorySlice = {
  syntheticKey: nanoid(),
  zoom: Number(window.localStorage.getItem(zoomKey)) || defaultZoom,
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
      state.zoom = defaultZoom;
      window.localStorage.removeItem(zoomKey);
    }),

    changeZoom: create.reducer((state, action: PayloadAction<'in' | 'out'>) => {
      const newZoom = action.payload === 'out' ? state.zoom - 10 : state.zoom + 10;
      state.zoom = clamp(newZoom, 30, 500);
      window.localStorage.setItem(zoomKey, String(state.zoom));
    }),
  }),
});

export const { openStory, resetZoom, changeZoom } = storySlice.actions;
