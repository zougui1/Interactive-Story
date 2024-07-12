import { ChevronUp, Plus, Copy } from 'lucide-react';

import { copyText } from '~/utils';

import { useStoryTreeContext } from './context';
import { Scene } from '../Scene';

export const StoryTreeCurrentScene = () => {
  const story = useStoryTreeContext();

  return (
    <Scene.Root
      text={story.currentScene.text}
      onChange={e => story.setSceneText(story.currentScene.id, e.currentTarget.value)}
    >
      <Scene.Button showOnHoverOnly position="topRight" onClick={() => copyText(story.currentScene.id)}>
        <Copy className="w-4" />
      </Scene.Button>

      {story.parentScene && (
        <Scene.Button position="topMiddle" onClick={story.goToParentScene}>
          <ChevronUp className="w-6" />
        </Scene.Button>
      )}

      {!story.readOnly && (
        <Scene.Button position="bottomMiddle" onClick={story.addChoice}>
          <Plus className="w-4" />
        </Scene.Button>
      )}
    </Scene.Root>
  );
}
