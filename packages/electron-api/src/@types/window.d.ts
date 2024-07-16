import type { IContextBridge } from '@zougui/interactive-story.electron-utils';

declare global {
  export interface Window {
    electron?: IContextBridge | undefined;
  }
}
