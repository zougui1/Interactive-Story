import { createContext, useContext, useMemo, useState, useCallback } from 'react';

import { type Story } from '@zougui/interactive-story.story';

export interface StoryTreeState {
  sceneIdStack: string[];
  readOnly?: boolean;
  currentSceneId: string;
  parentSceneId: string | undefined;
  goToChildScene: (childSceneId: string) => void;
  goToParentScene: () => void;
}

const StoryTreeContext = createContext<StoryTreeState | undefined>(undefined);

export const StoryTreeProvider = ({
  children,
  readOnly,
  defaultStory,
  onCurrentSceneChange,
}: StoryTreeProviderProps) => {
  const [sceneIdStack, setSceneIdStack] = useState(defaultStory.sceneIdStack);

  const goToChildScene = useCallback((childSceneId: string) => {
    setSceneIdStack((prevSceneIdStack) => {
      onCurrentSceneChange?.(childSceneId);
      return [...prevSceneIdStack, childSceneId];
    });
  }, [onCurrentSceneChange]);

  const goToParentScene = useCallback(() => {
    setSceneIdStack((prevSceneIdStack) => {
      const newSceneIdStack = prevSceneIdStack.slice(0, -1);
      const [newCurrentSceneId] = newSceneIdStack.slice().reverse();

      onCurrentSceneChange?.(newCurrentSceneId);

      return newSceneIdStack;
    });
  }, [onCurrentSceneChange]);

  const state = useMemo(() => {
    const [currentSceneId, parentSceneId] = sceneIdStack.slice().reverse();

    return {
      readOnly,
      sceneIdStack,
      currentSceneId: currentSceneId,
      parentSceneId: parentSceneId,
      goToChildScene,
      goToParentScene,
    };
  }, [
    readOnly,
    sceneIdStack,
    goToChildScene,
    goToParentScene,
  ]);

  return <StoryTreeContext.Provider value={state}>{children}</StoryTreeContext.Provider>;
}

export interface StoryTreeProviderProps {
  readOnly?: boolean;
  defaultStory: Story;
  children?: React.ReactNode;
  onCurrentSceneChange?: (sceneId: string) => void;
}

export const useStoryTreeContext = (): StoryTreeState => {
  const context = useContext(StoryTreeContext);

  if (!context) {
    throw new Error('Cannot use StoryTreeContext outside of the StoryTreeProvider component tree');
  }

  return context;
}
