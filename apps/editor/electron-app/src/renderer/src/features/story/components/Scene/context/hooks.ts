import { useContext } from 'react';

import { SceneContext, type SceneState } from './Provider';


export const useSceneContext = (): SceneState => {
  const context = useContext(SceneContext);

  if (!context) {
    throw new Error('Cannot use SceneContext outside of the SceneProvider component tree');
  }

  return context;
}
