import { createContext, useContext, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

import {
  ChoiceType,
  type Story,
  type Scene,
  type SceneChoice,
  type SceneReference,
} from '@zougui/interactive-story.story';

export interface StoryTreeState {
  readOnly?: boolean;
  id: string;
  title: string;
  scenes: Record<string, Scene>;
  choices: Record<string, SceneChoice>;
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
  setTitle: (title: string) => void;
}

const StoryTreeContext = createContext<StoryTreeState | undefined>(undefined);

export const StoryTreeProvider = ({
  children,
  readOnly,
  defaultStory,
  onCurrentSceneChange,
  onChange,
}: StoryTreeProviderProps) => {
  const [title, setTitle] = useState(defaultStory.title);
  const [id] = useState(defaultStory.id);
  const [scenes, setScenes] = useState(defaultStory.scenes);
  const [choices, setChoices] = useState(defaultStory.choices);
  const [sceneIdStack, setSceneIdStack] = useState(defaultStory.sceneIdStack);
  const [sceneReferences, setSceneReferences] = useState(defaultStory.sceneReferences);
  const [stats, setStats] = useState(defaultStory.stats);
  const [statReferences, setStatReferences] = useState(defaultStory.statReferences);

  const changeHandlerRef = useRef(onChange);
  changeHandlerRef.current = onChange;

  useEffect(() => {
    changeHandlerRef.current?.({
      id,
      title,
      scenes,
      choices,
      sceneIdStack,
      sceneReferences,
      stats,
      statReferences,
    });
  }, [id, title, scenes, choices, sceneIdStack, sceneReferences, stats, statReferences]);

  const addChoice = useCallback(() => {
    setScenes((prevScenes) => {
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

      setSceneReferences((prevSceneReferences) => {
        return {
          ...prevSceneReferences,
          [newScene.id]: { count: 1 },
        };
      });

      const newChoice = {
        id: nanoid(),
        type: ChoiceType.Branch,
        text: '',
        sceneId: newScene.id,
      };

      setChoices(prevChoices => {
        return {
          ...prevChoices,
          [newChoice.id]: newChoice,
        };
      });

      return {
        ...prevScenes,
        [newScene.id]: newScene,
        [currentScene.id]: {
          ...currentScene,
          choices: [
            ...(currentScene.choices || []),
            newChoice.id,
          ],
        },
      };
    });
  }, [sceneIdStack]);

  const goToChildScene = useCallback((childSceneId: string) => {
    setSceneIdStack((prevSceneIdStack) => {
      onCurrentSceneChange?.(scenes[childSceneId]);
      return [...prevSceneIdStack, childSceneId];
    });
  }, [onCurrentSceneChange, scenes]);

  const goToParentScene = useCallback(() => {
    setSceneIdStack((prevSceneIdStack) => {
      const newSceneIdStack = prevSceneIdStack.slice(0, -1);
      const [newCurrentSceneId] = newSceneIdStack.slice().reverse();

      onCurrentSceneChange?.(scenes[newCurrentSceneId]);

      return newSceneIdStack;
    });
  }, [onCurrentSceneChange, scenes]);

  const setSceneText = useCallback((sceneId: string, text: string) => {
    setScenes((prevScenes) => {
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
    setChoices(prevChoices => {
      const prevChoice = prevChoices[choiceId];

      if (!prevChoice) {
        return prevChoices;
      }

      return {
        ...prevChoices,
        [choiceId]: {
          ...prevChoice,
          text,
        },
      };
    });
    /*setScenes((prevScenes) => {
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
          choices: currentScene.choices?.map((choice) => {
            if (choice.id !== choiceId) {
              return choice;
            }

            return { ...choice, text };
          }),
        },
      };
    });*/
  }, []);

  const setChoiceBranch = useCallback((choiceId: string) => {
    const newScene = {
      id: nanoid(),
      text: '',
    };

    setChoices(prevChoices => {
      const prevChoice = prevChoices[choiceId];

      if (!prevChoice) {
        return prevChoices;
      }

      return {
        ...prevChoices,
        [choiceId]: {
          ...prevChoice,
          type: ChoiceType.Branch,
          sceneId: newScene.id,
        },
      };
    });
    /*setScenes((prevScenes) => {
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
    });*/
  }, []);

  const setChoiceJump = useCallback((choiceId: string, sceneId: string) => {
    setChoices(prevChoices => {
      const prevChoice = prevChoices[choiceId];

      if (!prevChoice || prevChoice.sceneId === sceneId) {
        return prevChoices;
      }

      const newChoices = {
        ...prevChoices,
        [choiceId]: {
          ...prevChoice,
          type: ChoiceType.Jump,
          sceneId,
        },
      };

      const prevSceneReference = sceneReferences[prevChoice.sceneId];
      const nextSceneReference = sceneReferences[sceneId];

      const newSceneReferences = {
        ...sceneReferences,
        [prevChoice.sceneId]: {
          count: prevSceneReference ? prevSceneReference.count - 1 : 0,
        },
        [sceneId]: {
          count: nextSceneReference ? nextSceneReference.count + 1 : 0,
        },
      };
      const newScenes = { ...scenes };

      if (newSceneReferences[prevChoice.sceneId].count <= 0) {
        delete newSceneReferences[prevChoice.sceneId];
        delete newScenes[prevChoice.sceneId];
      }

      setSceneReferences(newSceneReferences);
      setScenes(newScenes);

      return newChoices;
    });
    /*setScenes((prevScenes) => {
      const [currentSceneId] = sceneIdStack.slice().reverse();

      if (!currentSceneId) {
        return prevScenes;
      }

      const currentScene = prevScenes[currentSceneId];

      if (!currentScene) {
        prevScenes;
      }

      const affectedChoice = currentScene.choices?.find((choice) => choice.id === choiceId);

      if (affectedChoice?.sceneId === sceneId) {
        return prevScenes;
      }

      const newScenes = {
        ...prevScenes,
        [currentScene.id]: {
          ...currentScene,
          choices: currentScene.choices?.map((choice) => {
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
    });*/
  }, [scenes, sceneReferences]);

  const deleteChoice = useCallback((choiceId: string) => {
    setChoices(prevChoices => {
      const prevChoice = prevChoices[choiceId];

      if (!prevChoice) {
        return prevChoices;
      }

      const newChoices = { ...prevChoices };
      delete newChoices[choiceId];

      const sceneReference = sceneReferences[prevChoice.sceneId];

      const newSceneReferences = {
        ...sceneReferences,
        [prevChoice.sceneId]: {
          count: sceneReference ? sceneReference.count - 1 : 0,
        },
      };
      const newScenes = { ...scenes };

      if (newSceneReferences[prevChoice.sceneId]?.count <= 0) {
        delete newSceneReferences[prevChoice.sceneId];
        delete newScenes[prevChoice.sceneId];
      }

      setSceneReferences(newSceneReferences);
      setScenes(newScenes);

      return newChoices;
    });
    /*setScenes((prevScenes) => {
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
    });*/
  }, [scenes, sceneReferences]);

  const state = useMemo(() => {
    const [currentSceneId, parentSceneId] = sceneIdStack.slice().reverse();

    return {
      readOnly,
      id,
      title,
      scenes,
      choices,
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
      setTitle,
    };
  }, [
    readOnly,
    id,
    title,
    scenes,
    choices,
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
    setTitle,
  ]);

  return <StoryTreeContext.Provider value={state}>{children}</StoryTreeContext.Provider>;
}

export interface StoryTreeProviderProps {
  readOnly?: boolean;
  defaultStory: Story;
  children?: React.ReactNode;
  onCurrentSceneChange?: (currentScene: Scene) => void;
  onChange?: (story: Story) => void;
}

export const useStoryTreeContext = (): StoryTreeState => {
  const context = useContext(StoryTreeContext);

  if (!context) {
    throw new Error('Cannot use StoryTreeContext outside of the StoryTreeProvider component tree');
  }

  return context;
}
