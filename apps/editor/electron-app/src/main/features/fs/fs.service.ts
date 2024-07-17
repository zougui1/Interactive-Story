import { dialog } from 'electron';

import { Zis } from '@zougui/interactive-story.zis';
import type { Story } from '@zougui/interactive-story.story';

import { env } from '../../env';

const zisFile = {
  extensions: [Zis.extension],
  name: Zis.name,
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
  const story = await Zis.readFile(filePath, env.staticKey);

  return { story, filePath };
}

export const saveFile = async (options: SaveFileOptions) => {
  const filePath = options.filePath ?? await getSaveFilePath();

  if (!filePath) {
    return;
  }

  await Zis.writeFile(filePath, options.story, env.staticKey);

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
