import { ChevronUp, Plus, Copy } from 'lucide-react';

import { copyText } from '@renderer/utils';

import { useStoryTreeContext } from './context';
import { Scene } from '../Scene';

export const StoryTreeCurrentScene = () => {
  const story = useStoryTreeContext();

  return (
    <Scene.Root>
      {story.parentScene && (
        <Scene.Button position="topMiddle" onClick={story.goToParentScene}>
          <ChevronUp className="w-6" />
        </Scene.Button>
      )}

      <Scene.Button
        showOnHoverOnly
        position="topRight"
        onClick={() => copyText(story.currentScene.id)}
      >
        <Copy className="w-4" />
      </Scene.Button>

      <Scene.Textarea
        value={story.currentScene.text}
        onChange={e => story.setSceneText(story.currentScene.id, e.currentTarget.value)}
      />

      {!story.readOnly && (
        <Scene.Button position="bottomMiddle" onClick={story.addChoice}>
          <Plus className="w-4" />
        </Scene.Button>
      )}
    </Scene.Root>
  );
}
