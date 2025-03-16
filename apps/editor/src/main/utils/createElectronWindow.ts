import { BrowserWindow, screen, shell, type BrowserWindowConstructorOptions } from 'electron';

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
    show: false,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      ...options?.webPreferences,
    },
  });

  browserWindow.on('ready-to-show', () => {
    browserWindow.show();
  });

  browserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
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
