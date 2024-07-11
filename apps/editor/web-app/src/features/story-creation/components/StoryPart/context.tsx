import { createContext, useContext, useMemo } from 'react';

export interface StoryPartState {
  hovered: boolean;
}

const StoryPartContext = createContext<StoryPartState | undefined>(undefined);

export const StoryPartProvider = ({ children, hovered }: StoryPartProviderProps) => {
  const state = useMemo(() => {
    return { hovered };
  }, [hovered]);

  return (
    <StoryPartContext.Provider value={state}>
      {children}
    </StoryPartContext.Provider>
  )
}

export interface StoryPartProviderProps {
  hovered: boolean;
  children?: React.ReactNode;
}

export const useStoryPartContext = (): StoryPartState => {
  const context = useContext(StoryPartContext);

  if (!context) {
    throw new Error('Cannot use StoryPartContext outside of the StoryPartProvider component tree');
  }

  return context;
}
