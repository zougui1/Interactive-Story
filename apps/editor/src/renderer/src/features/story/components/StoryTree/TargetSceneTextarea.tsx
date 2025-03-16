import { ArrowDown, ArrowUpToLine, ChevronDown } from 'lucide-react';
import { useSelector } from '@xstate/store/react';

import { SceneChoiceTargetType } from '@zougui/interactive-story.story';
import { type SceneChoice, type SceneChoiceTarget } from '@zougui/interactive-story.story';

import { reorderArray } from '@renderer/utils';

import { useStoryTreeContext } from './context';
import { BadgeList } from './BadgeList';
import { StoryTreeSceneMenu } from './StoryTreeSceneMenu';
import { Scene } from '../Scene';
import { storyStore } from '../../story.store';

export const TargetSceneTextarea = ({ choice, target, onOpenChange, placeholder, children }: TargetSceneTextareaProps) => {
  const story = useStoryTreeContext();
  const stats = useSelector(storyStore, state => state.context.data.stats);
  const targetScene = useSelector(storyStore, state => state.context.data.scenes[target.sceneId]);

  const statIncrements = Object
    .entries(target.statIncrements ?? {})
    .map(([statId, value]) => ({
      value,
      id: statId,
      color: stats[statId].color,
      name: stats[statId].name,
    }));

  return (
    <>
      <ArrowDown className="w-5 h-5 mb-5" />

      <Scene.Textarea
        value={targetScene?.text ?? ''}
        onChange={e => storyStore.trigger.updateSceneText({ id: target.sceneId, text: e.currentTarget.value })}
        placeholder={placeholder}
      >
        {statIncrements.length > 0 && (
          <BadgeList
            className="max-w-[43%]"
            items={reorderArray(Object.values(stats), statIncrements)}
            renderValue={value => value > 0 ? `+${value}` : value}
          />
        )}

        {target.type === SceneChoiceTargetType.Jump && (
          <Scene.Badge position="topLeft" className="size-6">
            <ArrowUpToLine className="w-4" />
          </Scene.Badge>
        )}

        {children}

        <Scene.Button
          position="bottomMiddle"
          onClick={() => story.goToChildScene(target.sceneId)}
        >
          <ChevronDown className="w-6" />
        </Scene.Button>

        {!story.readOnly && (
          <StoryTreeSceneMenu
            choice={choice}
            target={target}
            onOpenChange={onOpenChange}
          />
        )}
      </Scene.Textarea>
    </>
  );
}

export interface TargetSceneTextareaProps {
  choice: SceneChoice;
  target: SceneChoiceTarget;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children?: React.ReactNode;
}
