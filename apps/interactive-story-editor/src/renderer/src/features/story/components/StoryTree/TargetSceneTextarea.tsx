import { SceneChoice, SceneChoiceTarget, SceneChoiceTargetType } from '@zougui/interactive-story.story';
import { ArrowDown, ArrowUpToLine, ChevronDown } from 'lucide-react';
import { Scene } from '../Scene';
import { useStoryTreeContext } from './context';
import { BadgeList } from './BadgeList';
import { useSelector } from '@xstate/store/react';
import { storyStore } from '../../story.store';
import { StoryTreeSceneMenu } from './StoryTreeSceneMenu';
import { reorderArray } from '@renderer/utils';

export const TargetSceneTextarea = ({ choice, target, onOpenChange, placeholder, children }: TargetSceneTextareaProps) => {
  const story = useStoryTreeContext();
  const stats = useSelector(storyStore, state => state.context.data.stats);

  const targetScene = story.scenes[target.sceneId];
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
        onChange={e => story.setSceneText(target.sceneId, e.currentTarget.value)}
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
