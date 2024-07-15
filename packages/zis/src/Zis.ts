import zlib from 'node:zlib';
import { promisify } from 'node:util';

import fs from 'fs-extra';

import { storySchema, type Story } from '@zougui/interactive-story.story';

import { encrypt, decrypt } from './crypto';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export const Zis = {
  extension: 'zis',
  name: 'Interactive Story',

  stringify: async (story: Story, staticKey: string): Promise<string> => {
    const str = JSON.stringify(story);
    const compressed = await gzip(str);
    const encrypted = encrypt(compressed, staticKey);

    return encrypted;
  },

  parse: async (encrypted: string, staticKey: string): Promise<Story> => {
    const compressed = decrypt(encrypted, staticKey);
    const str = await gunzip(compressed);
    const data = JSON.parse(str.toString('utf8'));

    return await storySchema.parseAsync(data);
  },

  readFile: async (filePath: string, staticKey: string): Promise<Story> => {
    const fileData = await fs.readFile(filePath, 'utf8');
    return await Zis.parse(fileData, staticKey);
  },

  writeFile: async (filePath: string, story: Story, staticKey: string): Promise<void> => {
    const data = await Zis.stringify(story, staticKey);
    await fs.writeFile(filePath, data);
  },
};
