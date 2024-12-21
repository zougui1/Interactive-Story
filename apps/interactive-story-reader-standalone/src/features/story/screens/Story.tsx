import { Fragment, useEffect, useRef } from 'react';

import type { Story as StoryData, SceneChoice } from '@zougui/interactive-story.story';

import { Separator } from '~/components/Separator';
import { scrollToBottom } from '~/utils';

import { ChoiceMenu } from '../components/ChoiceMenu';
import { FadingTextContainer } from '../components/FadingTextContainer';
import { usePersistedSaves, useStorySave } from '../storySave';
import { AppMarkdown } from '~/components/AppMarkdown';

export const Story = ({ story }: StoryProps) => {
  const menuRef = useRef<HTMLUListElement | null>(null);
  const currentStorySave = useStorySave();
  const [, setPersistedSaves] = usePersistedSaves();

  const acts = currentStorySave.choiceIds.map((choiceId, index) => {
    const prevChoiceId = index > 0 ? currentStorySave.choiceIds[index - 1] : undefined;
    const prevChoice = prevChoiceId ? story.choices[prevChoiceId] : undefined;
    const choice = story.choices[choiceId];
    const prevSceneId = prevChoice?.sceneId ?? story.scenes.root.id;
    const prevScene = story.scenes[prevSceneId];

    return {
      scene: prevScene,
      choice,
    };
  });

  const lastAct = acts[acts.length - 1];
  const currentScene = lastAct
    ? story.scenes[lastAct.choice.sceneId]
    : story.scenes.root;

  const handleChoose = (choice: SceneChoice) => {
    currentStorySave.addChoiceId(choice.id);

    setPersistedSaves(prevPersistedSaves => {
      const prevChoiceIds = prevPersistedSaves?.[currentStorySave.id]?.choiceIds ?? [];

      return {
        ...prevPersistedSaves,
        [currentStorySave.id]: {
          id: currentStorySave.id,
          date: new Date(),
          choiceIds: [...prevChoiceIds, choice.id],
        },
      };
    });
  }

  useEffect(scrollToBottom, [acts]);

  useEffect(() => {
    menuRef.current?.scrollIntoView();
  }, [acts]);

  return (
    <div className="w-full flex flex-col space-y-12 pb-12 text-white">
      <h1 className="text-5xl font-bold text-center">
        {story.title}
      </h1>

      <FadingTextContainer className="space-y-4">
        {acts.map((prevScene, index) => (
          <Fragment key={index}>
            {/** correctly render new lines */}
            <AppMarkdown forceNewLines>{prevScene.scene.text}</AppMarkdown>
            <AppMarkdown forceNewLines>{prevScene.choice.text}</AppMarkdown>
          </Fragment>
        ))}
      </FadingTextContainer>

      <AppMarkdown forceNewLines>{currentScene.text}</AppMarkdown>

      <Separator />

      {currentScene.choices && (
        <ChoiceMenu
          key={currentScene.id}
          ref={menuRef}
          choices={currentScene.choices.map(choiceId => story.choices[choiceId]).filter(Boolean)}
          onChoose={handleChoose}
        />
      )}
    </div>
  );
}

export interface StoryProps {
  story: StoryData;
}
