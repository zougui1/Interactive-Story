import { app, BrowserWindow } from 'electron';

import { handleProcedure, type Router, type ElectronProcedure } from './router';

export const createElectronApp = async (options: CreateElectronAppOptions) => {
  await app.whenReady();

  let browserWindow = await options.createWindow();

  // Quit when all windows are closed
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', async () => {
    // On macOS it is common to re-create a window in the app when the dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      browserWindow = await options.createWindow();
    }
  });

  if (options.procedure && options.router) {
    handleProcedure({
      procedure: options.procedure,
      router: options.router,
      getWindow: () => browserWindow,
    });
  }
}

export interface CreateElectronAppOptions {
  createWindow: () => (Promise<BrowserWindow> | BrowserWindow);
  procedure?: ElectronProcedure;
  router?: Router;
}
