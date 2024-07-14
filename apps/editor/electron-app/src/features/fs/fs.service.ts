import zlib from 'node:zlib';
import { promisify } from 'node:util';

import { dialog } from 'electron';
import fs from 'fs-extra';

import { storySchema, type Story } from '@zougui/interactive-story.story';

import { Zis } from './Zis';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const zisFile = {
  extensions: ['zis'],
  name: 'Interactive Story',
};

export const openFile = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [zisFile],
  });

  if (result.canceled) {
    return;
  }

  const [filePath] = result.filePaths;
  const story = await Zis.readFile(filePath);

  return { story, filePath };
}

export const saveFile = async (options: SaveFileOptions) => {
  const filePath = options.filePath ?? await getSaveFilePath();

  if (!filePath) {
    return;
  }

  await Zis.writeFile(filePath, options.story);

  return { filePath };
}

export interface SaveFileOptions {
  filePath?: string;
  story: Story;
}

const getSaveFilePath = async () => {
  const result = await dialog.showSaveDialog({
    filters: [
      {
        extensions: ['zis'],
        name: 'Z Interactive Story',
      },
      {
        extensions: [],
        name: 'All files',
      },
    ],
  });

  if (!result.canceled) {
    return result.filePath;
  }
}
