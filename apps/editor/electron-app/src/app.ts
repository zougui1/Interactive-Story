import path from 'node:path';

import { createElectronWindow, createElectronApp, Router } from '@zougui/interactive-story.electron-utils';
import { electronApi } from '@zougui/interactive-story.electron-api';

import * as features from './features';
import { title } from './constants';
import { env } from './env';

const router = new Router();

for (const feature of Object.values(features)) {
  router.use(feature.router);
}

const createWindow = () => {
  const win = createElectronWindow({
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
    title,
    menuBarVisible: false,
    debug: env.isDev,
  });

  if (env.isDev) {
    win.loadURL(env.appUrl);
  } else {
    win.loadFile(env.appFile);
  }

  return win;
}

export const createApp = async () => {
  await createElectronApp({
    createWindow,
    procedure: electronApi,
    router,
  });
}
