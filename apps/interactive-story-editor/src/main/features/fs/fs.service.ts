import path from 'node:path';

import { dialog } from 'electron';
import fs from 'fs-extra';

import { Zis } from '@zougui/interactive-story.zis';
import type { Story } from '@zougui/interactive-story.story';

import { extraResourcesPath } from '../../constants';

const reInvalidFileNameCharacters = /[/.]/g;
const storyDataPlaceholder = '___z&w_story_data___';
const storyTitlePlaceholder = '___z&w_story_title___';

const zisFile = {
  extensions: [Zis.extension],
  name: Zis.name,
};

export const openFile = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      zisFile,
      {
        extensions: [],
        name: 'All files',
      },
    ],
  });

  if (result.canceled) {
    return;
  }

  const [filePath] = result.filePaths;
  const story = await Zis.readFile(filePath);

  return { story, filePath };
}

export const saveFile = async (options: SaveFileOptions) => {
  const filePath = options.filePath ?? await getSaveFilePath({
    storyTitle: options.story.title,
    fileMetadata: zisFile,
  });

  console.log('saveFile: filePath', filePath)

  if (!filePath) {
    return;
  }

  await Zis.writeFile(filePath, options.story);

  return { filePath };
}

export const exportHtml = async (options: SaveFileOptions) => {
  const filePath = await getSaveFilePath({
    defaultPath: options.filePath,
    storyTitle: options.story.title,
    fileMetadata: {
      extensions: ['html'],
      name: 'HTML',
    },
  });

  if (!filePath) {
    return;
  }

  const htmlTemplatePath = path.join(extraResourcesPath, 'index.html');
  const htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf8');
  const htmlContent = htmlTemplate
    .replace(storyTitlePlaceholder, options.story.title)
    .replace(`"${storyDataPlaceholder}"`, JSON.stringify(options.story));

  await fs.writeFile(filePath, htmlContent);

  return { filePath };
}

export interface SaveFileOptions {
  filePath?: string;
  story: Story;
}

const getSaveFilePath = async (options: GetSaveFilePathOptions) => {
  const { fileMetadata, defaultPath, storyTitle } = options;

  const result = await dialog.showSaveDialog({
    filters: [
      fileMetadata,
      {
        extensions: [],
        name: 'All files',
      },
    ],
    defaultPath: defaultPath ?? storyTitle?.replaceAll(reInvalidFileNameCharacters, '_'),
  });

  if (!result.canceled) {
    const [extension] = fileMetadata.extensions;

    if (!extension || result.filePath.endsWith(`.${extension}`)) {
      return result.filePath;
    }

    return `${result.filePath}.${extension}`;
  }
}

interface GetSaveFilePathOptions {
  storyTitle?: string;
  defaultPath?: string;
  fileMetadata: SaveFileMetadata;
}

interface SaveFileMetadata {
  extensions: string[];
  name: string;
}
