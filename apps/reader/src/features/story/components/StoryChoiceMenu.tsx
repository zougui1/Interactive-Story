import { useSelector } from '@xstate/store/react';

import { SceneChoice } from '@zougui/interactive-story.story';

import { randomItem } from '~/utils';

import { ChoiceMenu } from './ChoiceMenu';
import { selectActs, storySaveStore } from '../storySave';
import { story } from '../story';

export const StoryChoiceMenu = () => {
  const currentAct = useSelector(storySaveStore, state => selectActs(state).at(-1));
  const currentScene = currentAct ? story.scenes[currentAct.scene.id] : story.scenes.root;

  const checkStats = (statCheck: NonNullable<SceneChoice['check']>['stats']): boolean => {
    const { stats } = storySaveStore.getSnapshot().context;

    return Object.entries(statCheck).every(([statId, value]) => {
      return stats[statId] && stats[statId].value >= value;
    });
  }

  const handleChoose = (choice: SceneChoice) => {
    if (!choice.check) {
      const target = randomItem(Object.values(choice.targets.success ?? {}));

      storySaveStore.trigger.addAct({
        choiceId: choice.id,
        targetId: target.targetId,
        targetType: target.targetType,
      });

      if (target.statIncrements) {
        storySaveStore.trigger.incrementStats({ stats: target.statIncrements });
      }

      return;
    }

    if (!choice.targets.fail && choice.check.failEffect === 'branch') {
      console.log(`Missing fail scene outcome for choice: ${choice.id}`);
      return;
    }

    const targetGroup = checkStats(choice.check.stats) ? choice.targets.success : choice.targets.fail;

    if (!targetGroup) {
      return;
    }

    const target = randomItem(Object.values(targetGroup));

    storySaveStore.trigger.addAct({
      choiceId: choice.id,
      targetId: target.targetId,
      targetType: target.targetType,
    });

    if (target.statIncrements) {
      storySaveStore.trigger.incrementStats({ stats: target.statIncrements });
    }
  }

  if (!currentScene?.choices?.length) {
    return null;
  }

  return (
    <ChoiceMenu
      key={currentScene.id}
      story={story}
      choices={currentScene.choices.map(choiceId => story.choices[choiceId]).filter(Boolean)}
      onChoose={handleChoose}
    />
  );
}
