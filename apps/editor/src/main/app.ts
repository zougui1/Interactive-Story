import path from 'node:path';

import { app, BrowserWindow } from 'electron';
import { electronApp, is } from '@electron-toolkit/utils';

import { createElectronWindow, handleProcedure, Router } from './utils';
import * as features from './features';
import { env } from './env';
import { electronApi } from '../common';
import icon from '../../resources/icon.png?asset';

const router = new Router();

for (const feature of Object.values(features)) {
  router.use(feature.router);
}

const createWindow = (): BrowserWindow => {
  const mainWindow = createElectronWindow({
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
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

export const createApp = async (): Promise<void> => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  await app.whenReady();
  electronApp.setAppUserModelId('com.electron.interactive-story-editor');
  let browserWindow = createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      browserWindow = createWindow();
    }
  });

  handleProcedure({
    procedure: electronApi,
    router,
    getWindow: () => browserWindow,
  });
};
