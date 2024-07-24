import { Fragment, useEffect, useState } from 'react';

import type { Story as StoryData, Scene, SceneChoice } from '@zougui/interactive-story.story';

import { Separator } from '@renderer/components/Separator';
import { useWindowEvent } from '@renderer/hooks';
import { useAppDispatch, useAppSelector } from '@renderer/store';

import { ChoiceMenu } from '../components/ChoiceMenu';
import { FadingTextContainer } from '../components/FadingTextContainer';
import { changeZoom } from '../storySlice';

interface PrevScene extends Scene {
  choice: SceneChoice;
}

export const Story = ({ story }: StoryProps) => {
  const [prevScenes, setPrevScenes] = useState<PrevScene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene>(story.scenes.root);
  const zoom = useAppSelector(state => state.story.zoom);
  const dispatch = useAppDispatch();

  const handleChoose = (choice: SceneChoice) => {
    setPrevScenes((prevScenes) => {
      return [...prevScenes, { ...currentScene, choice }];
    });

    setCurrentScene(story.scenes[choice.sceneId]);
  }

  useEffect(() => {
    window.scrollTo({ top: Number.MAX_SAFE_INTEGER });
  }, [prevScenes]);

  useWindowEvent('wheel', e => {
    if (!e.ctrlKey) {
      return;
    }

    const zoomDirection = e.deltaY < 0 ? 'in' : 'out';
    dispatch(changeZoom(zoomDirection));
  });

  return (
    <div style={{ zoom: `${zoom}%` }} className="w-full flex flex-col space-y-12 pb-12 text-white">
      <FadingTextContainer className="space-y-4" zoom={zoom}>
        <h1 className="text-5xl font-bold text-center">
          {story.title}
        </h1>

        {prevScenes.map((prevScene, index) => (
          <Fragment key={index}>
            <pre>{prevScene.text}</pre>
            <pre>{prevScene.choice.text}</pre>
          </Fragment>
        ))}
      </FadingTextContainer>

      <pre>{currentScene.text}</pre>

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
