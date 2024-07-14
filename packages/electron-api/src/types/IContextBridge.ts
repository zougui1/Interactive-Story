import { ElectronRequest } from './ElectronRequest';

export interface IContextBridge {
  send(channel: string, data?: unknown): void;
  on(channel: string, listener: (event: unknown, data: ElectronRequest) => void): (() => void);
  once(channel: string, listener: (event: unknown, data: ElectronRequest) => void): (() => void);
}
