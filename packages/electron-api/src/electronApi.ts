import zod from 'zod';

import { storySchema } from '@zougui/interactive-story.story';

export const electronApi = {
  fs: {
    openFile: {
      fullPath: '/fs/open-file',

      params: zod.object({}),

      response: zod.object({
        story: storySchema,
        filePath: zod.string(),
      }).optional(),
    },

    save: {
      fullPath: '/fs/save',

      params: zod.object({
        story: storySchema,
        filePath: zod.string().optional(),
      }),

      response: zod.void(),
    },
  },

  window: {
    titleReset: {
      fullPath: '/window/title-reset',

      params: zod.object({}),
      response: zod.void(),
    },
  },
};
