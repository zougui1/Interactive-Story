import { ChevronUp, Plus, Copy } from 'lucide-react';

import { cn, copyText } from '@renderer/utils';

import { useStoryTreeContext } from './context';
import { Scene } from '../Scene';
import { useSelector } from '@xstate/store/react';
import { storyStore } from '../../story.store';

export const StoryTreeCurrentScene = () => {
  const story = useStoryTreeContext();
  const currentScene = useSelector(storyStore, state => state.context.data.scenes[story.currentSceneId]);

  if (!currentScene) {
    return null;
  }

  return (
    <Scene.Root className={cn(story.parentSceneId && 'pt-12')}>
      {story.parentSceneId && (
        <Scene.Button position="topMiddle" onClick={story.goToParentScene}>
          <ChevronUp className="w-6" />
        </Scene.Button>
      )}

      <Scene.Button
        showOnHoverOnly
        position="topRight"
        onClick={() => copyText(currentScene.id)}
      >
        <Copy className="w-4" />
      </Scene.Button>

      <Scene.Textarea
        value={currentScene.text}
        onChange={e => storyStore.trigger.updateSceneText({ id: currentScene.id, text: e.currentTarget.value })}
      />

      {!story.readOnly && (
        <Scene.Button position="bottomMiddle" onClick={() => storyStore.trigger.addChoice({ sceneId: currentScene.id })}>
          <Plus className="w-4" />
        </Scene.Button>
      )}
    </Scene.Root>
  );
}
