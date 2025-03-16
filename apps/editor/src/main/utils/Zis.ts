import fs from 'fs-extra';

import { storySchema, type Story } from '@zougui/interactive-story.story';

export const Zis = {
  extension: 'json',
  name: 'JSON',

  stringify: async (story: Story): Promise<string> => {
    return JSON.stringify(story);
  },

  parse: async (rawData: string): Promise<Story> => {
    const data = JSON.parse(rawData);
    return await storySchema.parseAsync(data);
  },

  readFile: async (filePath: string): Promise<Story> => {
    const fileData = await fs.readFile(filePath, 'utf8');
    return await Zis.parse(fileData);
  },

  writeFile: async (filePath: string, story: Story): Promise<void> => {
    const data = await Zis.stringify(story);
    await fs.writeFile(filePath, data);
  },
};
