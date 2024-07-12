import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

import { ChoiceType } from '../../enums';
import type { SceneReference, Scene } from '../../types';

export interface StoryTreeState {
  readOnly?: boolean;
  scenes: Record<string, Scene>;
  sceneReferences: Record<string, SceneReference>;
  sceneIdStack: string[];
  currentScene: Scene;
  parentScene: Scene | undefined;
  addChoice: () => void;
  goToChildScene: (childSceneId: string) => void;
  goToParentScene: () => void;
  setSceneText: (sceneId: string, text: string) => void;
  setChoiceText: (choiceId: string, text: string) => void;
  setChoiceBranch: (choiceId: string) => void;
  setChoiceJump: (choiceId: string, sceneId: string) => void;
  deleteChoice: (choiceId: string) => void;
}

const StoryTreeContext = createContext<StoryTreeState | undefined>(undefined);

export const StoryTreeProvider = ({ children, readOnly, defaultScenes, defaultSceneIdStack, defaultSceneReferences, onCurrentSceneChange }: StoryTreeProviderProps) => {
  const [scenes, setScenes] = useState(defaultScenes);
  const [sceneIdStack, setSceneIdStack] = useState(defaultSceneIdStack);
  const [sceneReferences, setSceneReferences] = useState(defaultSceneReferences);

  const addChoice = useCallback(() => {
    setScenes(prevScenes => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      const newScene = {
        id: nanoid(),
        text: '',
      };

      setSceneReferences(prevSceneReferences => {
        return {
          ...prevSceneReferences,
          [newScene.id]: { count: 1 },
        };
      });

      return {
        ...prevScenes,
        [newScene.id]: newScene,
        [currentScene.id]: {
          ...currentScene,
          choices: [
            ...(currentScene.choices || []),
            {
              id: nanoid(),
              type: ChoiceType.Branch,
              text: '',
              sceneId: newScene.id,
            },
          ],
        },
      };
    });
  }, [sceneIdStack]);

  const goToChildScene = useCallback((childSceneId: string) => {
    setSceneIdStack(prevSceneIdStack => {
      onCurrentSceneChange?.(scenes[childSceneId]);
      return [...prevSceneIdStack, childSceneId];
    });
  }, [onCurrentSceneChange, scenes]);

  const goToParentScene = useCallback(() => {
    setSceneIdStack(prevSceneIdStack => {
      const newSceneIdStack = prevSceneIdStack.slice(0, -1);
      const [newCurrentSceneId] = newSceneIdStack.slice().reverse();

      onCurrentSceneChange?.(scenes[newCurrentSceneId]);

      return newSceneIdStack;
    });
  }, [onCurrentSceneChange, scenes]);

  const setSceneText = useCallback((sceneId: string, text: string) => {
    setScenes(prevScenes => {
      const scene = prevScenes[sceneId];

      if (!scene) {
        prevScenes;
      }

      return {
        ...prevScenes,
        [scene.id]: {
          ...scene,
          text,
        },
      };
    });
  }, []);

  const setChoiceText = useCallback((choiceId: string, text: string) => {
    setScenes(prevScenes => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      return {
        ...prevScenes,
        [currentScene.id]: {
          ...currentScene,
          choices: currentScene.choices?.map(choice => {
            if (choice.id !== choiceId) {
              return choice;
            }

            return { ...choice, text };
          }),
        },
      };
    });
  }, [sceneIdStack]);

  const setChoiceBranch = useCallback((choiceId: string) => {
    setScenes(prevScenes => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      const newScene = {
        id: nanoid(),
        text: '',
      };

      return {
        ...prevScenes,
        [newScene.id]: newScene,
        [currentScene.id]: {
          ...currentScene,
          choices: currentScene.choices?.map(choice => {
            if (choice.id !== choiceId) {
              return choice;
            }

            return {
              ...choice,
              type: ChoiceType.Branch,
              sceneId: newScene.id,
            };
          }),
        },
      };
    });
  }, [sceneIdStack]);

  const setChoiceJump = useCallback((choiceId: string, sceneId: string) => {
    setScenes(prevScenes => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      const affectedChoice = currentScene.choices?.find(choice => choice.id === choiceId);

      if (affectedChoice?.sceneId === sceneId) {
        return prevScenes;
      }

      const newScenes = {
        ...prevScenes,
        [currentScene.id]: {
          ...currentScene,
          choices: currentScene.choices?.map(choice => {
            if (choice.id !== choiceId) {
              return choice;
            }

            return {
              ...choice,
              type: ChoiceType.Jump,
              sceneId,
            };
          }),
        },
      };

      if (affectedChoice) {
        const prevSceneReference = sceneReferences[affectedChoice.sceneId];
        const nextSceneReference = sceneReferences[sceneId];

        const newSceneReferences = {
          ...sceneReferences,
          [affectedChoice.sceneId]: {
            count: prevSceneReference ? prevSceneReference.count - 1 : 0,
          },
          [sceneId]: {
            count: nextSceneReference ? nextSceneReference.count + 1 : 0,
          },
        };

        if (newSceneReferences[affectedChoice.sceneId].count <= 0) {
          delete newSceneReferences[affectedChoice.sceneId];
          delete newScenes[affectedChoice.sceneId];
        }

        setSceneReferences(newSceneReferences);
      }

      return newScenes;
    });
  }, [sceneIdStack, sceneReferences]);

  const deleteChoice = useCallback((choiceId: string) => {
    setScenes(prevScenes => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      const newScenes = {
        ...prevScenes,
        [currentScene.id]: {
          ...currentScene,
          choices: currentScene.choices?.filter(choice => choice.id !== choiceId),
        },
      };

      const removedChoice = currentScene.choices?.find(choice => choice.id === choiceId);

      if (removedChoice) {
        const sceneReference = sceneReferences[removedChoice.sceneId];

        const newSceneReferences = {
          ...sceneReferences,
          [removedChoice.sceneId]: {
            count: sceneReference ? sceneReference.count - 1 : 0,
          },
        };

        if (newSceneReferences[removedChoice.sceneId]?.count <= 0) {
          delete newSceneReferences[removedChoice.sceneId];
          delete newScenes[removedChoice.sceneId];
        }

        setSceneReferences(newSceneReferences);
      }

      return newScenes;
    });
  }, [sceneIdStack, sceneReferences]);

  const state = useMemo(() => {
    const [currentSceneId, parentSceneId] = sceneIdStack.slice().reverse();

    return {
      readOnly,
      scenes,
      sceneIdStack,
      sceneReferences,
      currentScene: scenes[currentSceneId],
      parentScene: parentSceneId ? scenes[parentSceneId] : undefined,
      addChoice,
      goToChildScene,
      goToParentScene,
      setSceneText,
      setChoiceText,
      setChoiceJump,
      setChoiceBranch,
      deleteChoice,
    };
  }, [
    readOnly,
    scenes,
    sceneIdStack,
    sceneReferences,
    addChoice,
    goToChildScene,
    goToParentScene,
    setSceneText,
    setChoiceText,
    setChoiceJump,
    setChoiceBranch,
    deleteChoice,
  ]);

  return (
    <StoryTreeContext.Provider value={state}>
      {children}
    </StoryTreeContext.Provider>
  )
}

export interface StoryTreeProviderProps {
  readOnly?: boolean;
  defaultScenes: Record<string, Scene>;
  defaultSceneReferences: Record<string, SceneReference>;
  defaultSceneIdStack: string[];
  children?: React.ReactNode;
  onCurrentSceneChange?: (currentScene: Scene) => void;
}

export const useStoryTreeContext = (): StoryTreeState => {
  const context = useContext(StoryTreeContext);

  if (!context) {
    throw new Error('Cannot use StoryTreeContext outside of the StoryTreeProvider component tree');
  }

  return context;
}
