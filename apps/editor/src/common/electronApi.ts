import zod from 'zod';

import { storySchema } from '@zougui/interactive-story.story';

import { type ElectronProcedure } from './types';

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

    export: {
      html: {
        fullPath: '/fs/export/html',

        params: zod.object({
          story: storySchema,
          filePath: zod.string().optional(),
        }),

        response: zod.void(),
      },
    },
  },

  window: {
    title: {
      reset: {
        fullPath: '/window/title/reset',

        params: zod.object({}),
        response: zod.void(),
      },

      set: {
        fullPath: '/window/title/set',

        params: zod.object({
          title: zod.string(),
        }),
        response: zod.void(),
      },
    },
  },
} satisfies ElectronProcedure;
