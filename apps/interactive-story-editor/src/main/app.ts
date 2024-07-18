import path from 'node:path';

import { app } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';

import { createElectronWindow, createElectronApp, Router } from '@zougui/interactive-story.electron-utils';
import { electronApi } from '@zougui/interactive-story.electron-api';

import * as features from './features';
import { title } from './constants';
import { env } from './env';
import icon from '../../resources/icon.png?asset';

const router = new Router();

for (const feature of Object.values(features)) {
  router.use(feature.router);
}

const createWindow = () => {
  const mainWindow = createElectronWindow({
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
    title,
    menuBarVisible: false,
    debug: is.dev,
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && env.electronRendererUrl) {
    mainWindow.loadURL(env.electronRendererUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
}

export const createApp = async () => {
  await createElectronApp({
    createWindow,
    procedure: electronApi,
    router,
  });

  electronApp.setAppUserModelId('com.zougui.interactive-story.editor.app');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
}
