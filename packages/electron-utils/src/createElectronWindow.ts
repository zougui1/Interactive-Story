import { BrowserWindow, screen, type BrowserWindowConstructorOptions } from 'electron';

const defaultWidth = 1920;
const defaultHeight = 1080;

export const createElectronWindow = (options?: CreateElectronWindowOptions): BrowserWindow => {
  const point = screen.getCursorScreenPoint();
  const pointingDisplay = screen.getDisplayNearestPoint(point);

  const width = Math.min(defaultWidth, pointingDisplay.bounds.width);
  const height = Math.min(defaultHeight, pointingDisplay.bounds.height);

  const browserWindow = new BrowserWindow({
    width,
    height,
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
    browserWindow.webContents.openDevTools();
  }

  if (options?.menuBarVisible !== undefined) {
    browserWindow.menuBarVisible = options.menuBarVisible;
  }

  if (width >= pointingDisplay.bounds.width && height >= pointingDisplay.bounds.height) {
    browserWindow.maximize();
  }

  return browserWindow;
}

export interface CreateElectronWindowOptions extends BrowserWindowConstructorOptions {
  debug?: boolean;
  menuBarVisible?: boolean;
}
