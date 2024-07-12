import { createContext, useContext, useMemo } from 'react';

export interface SceneState {
  hovered: boolean;
}

const SceneContext = createContext<SceneState | undefined>(undefined);

export const SceneProvider = ({ children, hovered }: SceneProviderProps) => {
  const state = useMemo(() => {
    return { hovered };
  }, [hovered]);

  return (
    <SceneContext.Provider value={state}>
      {children}
    </SceneContext.Provider>
  )
}

export interface SceneProviderProps {
  hovered: boolean;
  children?: React.ReactNode;
}

export const useSceneContext = (): SceneState => {
  const context = useContext(SceneContext);

  if (!context) {
    throw new Error('Cannot use SceneContext outside of the SceneProvider component tree');
  }

  return context;
}
