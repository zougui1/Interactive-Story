import zlib from 'node:zlib';
import { promisify } from 'node:util';

import fs from 'fs-extra';

import { storySchema, type Story } from '@zougui/interactive-story.story';

import { encrypt, decrypt } from './crypto';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export const Zis = {
  stringify: async (story: Story): Promise<string> => {
    const str = JSON.stringify(story);
    const compressed = await gzip(str);
    const encrypted = encrypt(compressed);

    return encrypted;
  },

  parse: async (encrypted: string): Promise<Story> => {
    const compressed = decrypt(encrypted);
    const str = await gunzip(compressed);
    const data = JSON.parse(str.toString('utf8'));

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
