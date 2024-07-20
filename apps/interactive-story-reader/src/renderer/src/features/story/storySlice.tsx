import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';

import { Electron, electronApi } from '@zougui/interactive-story.electron-api';
import type { Story } from '@zougui/interactive-story.story';

import { createAppSlice } from '@renderer/store';

import { ToastMessage } from '@renderer/components/ToastMessage';

export interface StorySlice {
  syntheticKey: string;
  data?: Story;
  filePath?: string;
}

const initialState: StorySlice = {
  syntheticKey: nanoid(),
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
  }),
});

export const { openStory } = storySlice.actions;
