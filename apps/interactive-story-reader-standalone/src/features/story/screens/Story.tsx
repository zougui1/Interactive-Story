import { Fragment, useEffect } from 'react';
import { useSelector } from '@xstate/store/react';

import type { Story as StoryData, SceneChoice } from '@zougui/interactive-story.story';

import { Separator } from '~/components/Separator';

import { ChoiceMenu } from '../components/ChoiceMenu';
import { FadingTextContainer } from '../components/FadingTextContainer';
import { storySaveStore } from '../storySave';
import { AppMarkdown } from '~/components/AppMarkdown';
import { Progress } from '~/components/Progress';
import { Button } from '~/components/Button';

export const Story = ({ story }: StoryProps) => {
  const currentStorySave = useSelector(storySaveStore, state => state.context);

  useEffect(() => {
    storySaveStore.trigger.init({ story });
  }, [story]);

  const acts = currentStorySave.acts.map(({ choiceId, targetId }) => {
    const choice = story.choices[choiceId];
    const target = choice.targets[targetId as 'success'];
    const scene = story.scenes[target.sceneId];

    return {
      scene,
      choice,
    };
  });

  const lastAct = acts.pop();
  const currentScene = lastAct
    ? story.scenes[lastAct.scene.id]
    : story.scenes.root;

  const checkStats = (statCheck: NonNullable<SceneChoice['check']>['stats']): boolean => {
    return Object.entries(statCheck).every(([statId, value]) => {
      return currentStorySave.stats[statId] && currentStorySave.stats[statId].value >= value;
    });
  }

  const handleChoose = (choice: SceneChoice) => {
    if (!choice.check) {
      storySaveStore.trigger.addAct({
        choiceId: choice.id,
        targetId: choice.targets.success.id,
      });

      if (choice.targets.success.statIncrements) {
        storySaveStore.trigger.incrementStats({ stats: choice.targets.success.statIncrements });
      }

      return;
    }

    if (!choice.targets.fail && choice.check.failEffect === 'branch') {
      console.log(`Missing fail scene outcome for choice: ${choice.id}`);
      return;
    }

    const target = checkStats(choice.check.stats) ? choice.targets.success : choice.targets.fail;

    if (!target) {
      return;
    }

    storySaveStore.trigger.addAct({
      choiceId: choice.id,
      targetId: target.id,
    });

    if (target.statIncrements) {
      storySaveStore.trigger.incrementStats({ stats: target.statIncrements });
    }
  }

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight });
  }, [acts]);

  return (
    <div className="container w-screen box-border pl-8 md:max-3xl:pl-44 3xl:mx-auto">
      <h1 className="text-5xl font-bold text-center mb-8">
        {story.title}
      </h1>

      <div className="fixed -translate-x-[max(100%_+_1rem)] top-1/2 -translate-y-1/2 w-40 ml-2 flex flex-col gap-4 max-md:hidden">
        {Object.values(currentStorySave.stats).filter(stat => !story.stats[stat.id]?.hidden).map(stat => (
          <div key={stat.id} className="flex flex-col gap-2">
            <div className="flex justify-center gap-2" style={{ color: stat.color }}>
              <span>
                {stat.name}
              </span>

              <span>{stat.value}</span>
            </div>

            <Progress
              key={stat.id}
              value={stat.value}
              className="w-36 bg-gray-500"
              color={stat.color}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-12 pb-4 md:pb-12 text-white">
        <FadingTextContainer className="space-y-4">
          {lastAct && story.scenes.root && (
            <AppMarkdown forceNewLines>{story.scenes.root.text}</AppMarkdown>
          )}

          {acts.map((prevScene, index) => (
            <Fragment key={index}>
              <AppMarkdown forceNewLines>{`\\> ${prevScene.choice.text}`}</AppMarkdown>
              <AppMarkdown forceNewLines>{prevScene.scene.text}</AppMarkdown>
            </Fragment>
          ))}

          {lastAct && (
            <>
              <Separator />
              <AppMarkdown forceNewLines>{`\\> ${lastAct.choice.text}`}</AppMarkdown>
            </>
          )}

          <AppMarkdown forceNewLines>{currentScene.text}</AppMarkdown>
        </FadingTextContainer>

        {currentScene.choices && (
          <ChoiceMenu
            key={currentScene.id}
            story={story}
            choices={currentScene.choices.map(choiceId => story.choices[choiceId]).filter(Boolean)}
            onChoose={handleChoose}
          />
        )}

        {!currentScene.choices?.length && (
          <div>
            <Button onClick={() => storySaveStore.trigger.restart({ story })}>Play Again</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface StoryProps {
  story: StoryData;
}
