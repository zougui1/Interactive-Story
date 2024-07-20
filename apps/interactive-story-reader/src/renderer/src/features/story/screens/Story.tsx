import { Fragment, useEffect, useState } from 'react';

import type { Story as StoryData, Scene, SceneChoice } from '@zougui/interactive-story.story';

import { Separator } from '@renderer/components/Separator';

import { ChoiceMenu } from '../components/ChoiceMenu';

interface PrevScene extends Scene {
  choice: SceneChoice;
}

export const Story = ({ story }: StoryProps) => {
  const [prevScenes, setPrevScenes] = useState<PrevScene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene>(story.scenes.root);

  const handleChoose = (choice: SceneChoice) => {
    console.log('choice:', choice)
    setPrevScenes((prevScenes) => {
      return [...prevScenes, { ...currentScene, choice }];
    });

    setCurrentScene(story.scenes[choice.sceneId]);
  }

  useEffect(() => {
    window.scrollTo({ top: Number.MAX_SAFE_INTEGER });
  }, [prevScenes]);

  return (
    <div className="w-full flex flex-col space-y-12 pb-12">
      <h1 className="text-5xl font-bold text-center">
        {story.title}
      </h1>

      {prevScenes.map((prevScene, index) => (
        <Fragment key={index}>
          <p>{prevScene.text}</p>
          <p>{prevScene.choice.text}</p>
        </Fragment>
      ))}

      <p>{currentScene.text}</p>

      <Separator />

      {currentScene.choices && (
        <ChoiceMenu
          key={currentScene.id}
          choices={currentScene.choices}
          onChoose={handleChoose}
        />
      )}
    </div>
  );
}

export interface StoryProps {
  story: StoryData;
}
