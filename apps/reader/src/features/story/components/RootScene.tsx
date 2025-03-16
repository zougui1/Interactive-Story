import { useSelector } from '@xstate/store/react';

import { AppMarkdown } from '~/components/AppMarkdown';

import { story } from '../story';
import { selectActs, storySaveStore } from '../storySave';

export const RootScene = () => {
  const hasActs = useSelector(storySaveStore, state => selectActs(state).length > 0);

  if (!hasActs || !story.scenes.root) {
    return null;
  }

  return (
    <AppMarkdown forceNewLines>{story.scenes.root.text}</AppMarkdown>
  );
};
