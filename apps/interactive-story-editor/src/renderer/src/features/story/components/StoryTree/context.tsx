import { createContext, useContext, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

import { SceneChoiceTargetType, type Story, type Scene, SceneChoice, SceneChoiceTarget } from '@zougui/interactive-story.story';
import { useSelector } from '@xstate/store/react';
import { storyStore } from '../../story.store';
import { failEffectTypes } from '../stat/StatCheckDialog';

export interface StoryTreeState extends Story {
  readOnly?: boolean;
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
  updateChoiceStatCheck: (data: NonNullable<SceneChoice['check']> & { choiceId: string }) => void;
  removeChoiceStatCheck: (data: { choiceId: string }) => void;
  updateChoiceTargetStatIncrements: (data: { choiceId: string; targetId: string; statIncrements: SceneChoiceTarget['statIncrements']; }) => void;
}

const StoryTreeContext = createContext<StoryTreeState | undefined>(undefined);

// TODO refactor this. everything must be in the store and nothing in a local state
//! refactor this. everything must be in the store and nothing in a local state

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
  const stats = useSelector(storyStore, state => state.context.data.stats);
  const statReferences = useSelector(storyStore, state => state.context.data.statReferences);

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
        text: '',
        targets: {
          success: {
            id: 'success',
            type: SceneChoiceTargetType.Branch,
            sceneId: newScene.id,
          },
        },
      } satisfies SceneChoice;

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
        return prevScenes;
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
          type: SceneChoiceTargetType.Branch,
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
              type: SceneChoiceTargetType.Branch,
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

      if (!prevChoice || prevChoice.targets.success.sceneId === sceneId) {
        return prevChoices;
      }

      const newChoices = {
        ...prevChoices,
        [choiceId]: {
          ...prevChoice,
          targets: {
            ...prevChoice.targets,
            success: {
              ...prevChoice.targets.success,
              type: SceneChoiceTargetType.Jump,
              sceneId,
            },
          },
        } satisfies SceneChoice,
      };

      const prevSceneReference = sceneReferences[prevChoice.targets.success.sceneId];
      const nextSceneReference = sceneReferences[sceneId];

      const newSceneReferences = {
        ...sceneReferences,
        [prevChoice.targets.success.sceneId]: {
          count: prevSceneReference ? prevSceneReference.count - 1 : 0,
        },
        [sceneId]: {
          count: nextSceneReference ? nextSceneReference.count + 1 : 0,
        },
      };
      const newScenes = { ...scenes };

      if (newSceneReferences[prevChoice.targets.success.sceneId].count <= 0) {
        delete newSceneReferences[prevChoice.targets.success.sceneId];
        delete newScenes[prevChoice.targets.success.sceneId];
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
              type: SceneChoiceTargetType.Jump,
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

      const sceneReference = sceneReferences[prevChoice.targets.success.sceneId];

      const newSceneReferences = {
        ...sceneReferences,
        [prevChoice.targets.success.sceneId]: {
          count: sceneReference ? sceneReference.count - 1 : 0,
        },
      };
      const newScenes = { ...scenes };

      if (newSceneReferences[prevChoice.targets.success.sceneId]?.count <= 0) {
        delete newSceneReferences[prevChoice.targets.success.sceneId];
        delete newScenes[prevChoice.targets.success.sceneId];
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

  const updateChoiceStatCheck = useCallback((data: NonNullable<SceneChoice['check']> & { choiceId: string }) => {
    const { choiceId, failEffect, stats } = data;

    setChoices(prevChoices => {
      const branchNewScene = failEffect === failEffectTypes.branch && !prevChoices[choiceId].targets.fail;
      const newScene = {
        id: nanoid(),
        text: '',
      };

      const newFailTarget = {
        id: 'fail',
        sceneId: newScene.id,
        type: SceneChoiceTargetType.Branch,
      } satisfies SceneChoiceTarget;

      if (branchNewScene) {
        setScenes((prevScenes) => {
          const [currentSceneId] = sceneIdStack.slice().reverse();

          if (!currentSceneId) {
            return prevScenes;
          }

          const currentScene = prevScenes[currentSceneId];

          if (!currentScene) {
            prevScenes;
          }

          setSceneReferences((prevSceneReferences) => {
            return {
              ...prevSceneReferences,
              [newScene.id]: { count: 1 },
            };
          });

          return {
            ...prevScenes,
            [newScene.id]: newScene,
          };
        });
      }

      return {
        ...prevChoices,
        [choiceId]: {
          ...prevChoices[choiceId],
          check: {
            stats,
            failEffect,
          },
          targets: {
            ...prevChoices[choiceId].targets,
            fail: branchNewScene
              ? newFailTarget
              : prevChoices[choiceId].targets.fail,
          },
        },
      };
    });
  }, [sceneIdStack]);

  const removeChoiceStatCheck = useCallback((data: { choiceId: string }) => {
    const { choiceId } = data;

    setChoices(prevChoices => {
      const prevChoice = prevChoices[choiceId];

      if (prevChoice.targets.fail) {
        const failTarget = prevChoice.targets.fail;

        setScenes((prevScenes) => {
          const [currentSceneId] = sceneIdStack.slice().reverse();

          if (!currentSceneId) {
            return prevScenes;
          }

          const currentScene = prevScenes[currentSceneId];

          if (!currentScene) {
            prevScenes;
          }

          setSceneReferences((prevSceneReferences) => {
            const updatedSceneReferences = { ...prevSceneReferences };
            delete updatedSceneReferences[failTarget.id];

            return updatedSceneReferences;
          });

          const updatedScenes = { ...prevScenes };
          delete updatedScenes[failTarget.id];

          return updatedScenes;
        });
      }

      return {
        ...prevChoices,
        [choiceId]: {
          ...prevChoices[choiceId],
          check: undefined,
          targets: {
            ...prevChoices[choiceId].targets,
            fail: undefined,
          },
        },
      };
    });
  }, [sceneIdStack]);

  const updateChoiceTargetStatIncrements = useCallback((data: { choiceId: string; targetId: string; statIncrements: SceneChoiceTarget['statIncrements']; }) => {
    setChoices(prevChoices => {
      const { choiceId, targetId, statIncrements } = data;

      const increments = { ...statIncrements };

      for (const statId of Object.keys(increments)) {
        if (!increments[statId]) {
          delete increments[statId];
        }
      }

      return {
        ...prevChoices,
        [choiceId]: {
          ...prevChoices[choiceId],
          targets: {
            ...prevChoices[choiceId].targets,
            [targetId]: {
              ...prevChoices[choiceId].targets[targetId],
              statIncrements: increments,
            },
          },
        },
      };
    });
  }, []);

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
      stats,
      statReferences,
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
      updateChoiceStatCheck,
      updateChoiceTargetStatIncrements,
      removeChoiceStatCheck,
    };
  }, [
    readOnly,
    id,
    title,
    scenes,
    choices,
    sceneIdStack,
    sceneReferences,
    stats,
    statReferences,
    addChoice,
    goToChildScene,
    goToParentScene,
    setSceneText,
    setChoiceText,
    setChoiceJump,
    setChoiceBranch,
    deleteChoice,
    setTitle,
    updateChoiceStatCheck,
    updateChoiceTargetStatIncrements,
    removeChoiceStatCheck,
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
