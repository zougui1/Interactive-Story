import type { Scene, SceneReference } from './types';

export const defaultStoryData = {
  scenes: {
    root: {
      id: 'root',
      text: '',
    },
  },

  sceneReferences: {
    root: { count: 1 },
  },

  sceneIdStack: ['root'],
} satisfies Data;

type Data = {
  scenes: Record<string, Scene>;
  sceneReferences: Record<string, SceneReference>;
  sceneIdStack: string[];
};
