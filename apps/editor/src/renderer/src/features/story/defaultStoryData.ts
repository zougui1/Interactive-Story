import { nanoid } from 'nanoid';

import type { Story } from '@zougui/interactive-story.story';

export const rootId = 'root';

export const createDefaultStoryData = () => {
  return {
    id: nanoid(),
    title: '',

    scenes: {
      [rootId]: {
        id: rootId,
        text: '',
      },
    },

    choices: {},

    sceneReferences: {
      [rootId]: { count: 1 },
    },

    stats: {},
    statReferences: {},

    sceneIdStack: [rootId],
  } satisfies Story;
}
