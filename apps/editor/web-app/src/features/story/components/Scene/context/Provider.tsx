import { createContext, useMemo } from 'react';

export interface SceneState {
  hovered: boolean;
}

export const SceneContext = createContext<SceneState | undefined>(undefined);

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
