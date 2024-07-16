import type { Story } from '@zougui/interactive-story.story';
import { nanoid } from 'nanoid';

export const rootId = 'root';

export const createDefaultStoryData = () => {
  return {
    id: nanoid(),

    scenes: {
      [rootId]: {
        id: rootId,
        text: '',
      },
    },

    sceneReferences: {
      [rootId]: { count: 1 },
    },

    sceneIdStack: [rootId],
  } satisfies Story;
}
