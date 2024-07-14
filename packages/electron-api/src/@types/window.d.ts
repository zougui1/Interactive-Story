import type { IContextBridge } from '../types';

declare global {
  export interface Window {
    electron?: IContextBridge | undefined;
  }
}
