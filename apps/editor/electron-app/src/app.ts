import path from 'node:path';

import { app, BrowserWindow, ipcMain } from 'electron';

import type { ElectronRequest } from '@zougui/interactive-story.electron-api';

import { router } from './router';
import { title } from './constants';
import { env } from './env';
import type { Handler } from './utils';

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: path.join(__dirname, './preload.js'),
    },
    width: 1920,
    height: 1080,
    title,
  });

  win.menuBarVisible = false;

  if (env.nodeEnv === 'development') {
    win.webContents.openDevTools();
    win.loadURL(env.appUrl);
  } else {
    win.loadFile(env.appFile);
  }

  return win;
}

export const createApp = async () => {
  await app.whenReady();

  const browserWindow = createWindow();

  // Quit when all windows are closed
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS it is common to re-create a window in the app when the dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  for (const [path, handler] of Object.entries(router.handlers)) {
    handleRoute(browserWindow, path, handler);
  }
}

const handleRoute = (browserWindow: BrowserWindow, path: string, handler: Handler): void => {
  ipcMain.on(path, async (event, req: ElectronRequest) => {
    try {
      console.log(path);
      const body = await handler.schemas.params.parseAsync(req.body);
      const result = await handler.handle({
        request: {
          ...req,
          body,
        },
        browserWindow,
        sender: { id: event.sender.id },
      });
      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: result,
      };

      event.reply(`${path}.success`, response);
    } catch (error) {
      console.log('communication error:', error);

      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: error,
      };
      event.reply(`${path}.error`, response);
    }
  });
}
