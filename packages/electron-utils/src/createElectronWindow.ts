import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';

export const createElectronWindow = (options?: CreateElectronWindowOptions): BrowserWindow => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      ...options?.webPreferences,
    },
  });

  if (options?.debug) {
    win.webContents.openDevTools();
  }

  if (options?.menuBarVisible !== undefined) {
    win.menuBarVisible = options.menuBarVisible;
  }

  return win;
}

export interface CreateElectronWindowOptions extends BrowserWindowConstructorOptions {
  debug?: boolean;
  menuBarVisible?: boolean;
}
