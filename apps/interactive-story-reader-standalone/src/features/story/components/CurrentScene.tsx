import { AppMarkdown } from '~/components/AppMarkdown';

import { selectActs, storySaveStore } from '../storySave';
import { useSelector } from '@xstate/store/react';
import { story } from '../story';

export const CurrentScene = () => {
  const lastAct = useSelector(storySaveStore, state => selectActs(state).at(-1));
  const currentScene = lastAct ? story.scenes[lastAct.scene.id] : story.scenes.root;

  if (!currentScene) {
    return null;
  }

  return (
    <AppMarkdown forceNewLines>{currentScene.text}</AppMarkdown>
  );
}
