import { Button } from '~/components/Button';

import { selectActs, storySaveStore } from '../storySave';
import { useSelector } from '@xstate/store/react';
import { story } from '../story';

export const ReplayButton = () => {
  const isEnd = useSelector(storySaveStore, state => {
    const lastAct = selectActs(state).at(-1);
    const currentScene = lastAct ? story.scenes[lastAct.scene.id] : story.scenes.root;

    return !currentScene?.choices?.length;
  });

  if (!isEnd) {
    return null;
  }

  return (
    <div>
      <Button onClick={() => storySaveStore.trigger.restart()}>Play Again</Button>
    </div>
  );
}
