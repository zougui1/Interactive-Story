import { contextBridge, ipcRenderer } from 'electron';

import type { IContextBridge, ElectronRequest } from '@zougui/interactive-story.electron-utils';

export class ContextBridge implements IContextBridge {
  send = (channel: string, data: unknown): void => {
    ipcRenderer.send(channel, data);
  }

  on = (channel: string, listener: (event: unknown, request: ElectronRequest) => void): (() => void) => {
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.off(channel, listener);
  }

  once = (channel: string, listener: (event: unknown, request: ElectronRequest) => void): (() => void) => {
    ipcRenderer.once(channel, listener);
    return () => ipcRenderer.off(channel, listener);
  }
}

contextBridge.exposeInMainWorld('electron', new ContextBridge());
