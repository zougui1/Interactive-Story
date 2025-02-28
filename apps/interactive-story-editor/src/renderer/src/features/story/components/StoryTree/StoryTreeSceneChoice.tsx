import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useSelector } from '@xstate/store/react';

import { reorderArray } from '@renderer/utils';

import { useStoryTreeContext } from './context';
import { StoryTreeChoiceMenu } from './StoryTreeChoiceMenu';
import { BadgeList } from './BadgeList';
import { TargetSceneTextarea } from './TargetSceneTextarea';
import { Scene } from '../Scene';
import { failEffectTypes } from '../stat/StatCheckDialog';
import { storyStore, TargetType } from '../../story.store';

export interface BadgeProps {
  children?: React.ReactNode;
  color?: string;
}

export const StoryTreeSceneChoice = ({ choiceId }: StoryTreeSceneChoiceProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const story = useStoryTreeContext();
  const choice = useSelector(storyStore, state => state.context.data.choices[choiceId]);
  const stats = useSelector(storyStore, state => state.context.data.stats);

  const successTargets = choice.targets.success ?? {};
  const failTargets = choice.targets.fail ?? {};

  const hasCheckFailBranching = choice.check?.failEffect === failEffectTypes.branch;

  const handleNewTarget = (targetType: TargetType) => () => {
    storyStore.trigger.addChoiceTarget({
      choiceId,
      targetType,
    });
  }

  const statsCheck = Object
    .entries(choice.check?.stats ?? {})
    .map(([statId, value]) => ({
      value,
      id: statId,
      color: stats[statId].color,
      name: stats[statId].name,
    }));

  const choiceTextarea = (
    <Scene.Textarea
      value={choice.text}
      onChange={e => storyStore.trigger.updateChoiceText({ id: choice.id, text: e.currentTarget.value })}
      readOnly={story.readOnly}
      placeholder="Choice text"
      className="h-2/5"
      autoFocus
    >
      {statsCheck.length > 0 && (
        <BadgeList
          className="left-1/2 -translate-x-1/2"
          items={reorderArray(Object.values(stats), statsCheck)}
        />
      )}
    </Scene.Textarea>
  );

  const monoTargetSceneTextareas = (
    <div className="h-3/5 w-full whitespace-nowrap flex gap-2 overflow-x-auto box-content pb-5">
      {Object.values(successTargets).map(successTarget => (
        <div key={successTarget.targetId} className="h-full min-w-[100%] flex flex-col items-center">
          <TargetSceneTextarea
            choice={choice}
            target={successTarget}
            onOpenChange={setMenuOpen}
            placeholder="Scene text"
          >
            <Scene.Button
              showOnHoverOnly
              position="middleRight"
              className="size-6"
              onClick={handleNewTarget(successTarget.targetType)}
            >
              <Plus className="size-4" />
            </Scene.Button>
          </TargetSceneTextarea>
        </div>
      ))}
    </div>
  );

  const splitTargetSceneTextarea = (
    <div className="flex gap-1 h-[calc(60%-2rem)] w-full">
      <div className="h-full w-1/2 whitespace-nowrap flex gap-2 overflow-x-auto box-content pb-5">
        {Object.values(successTargets).map(successTarget => (
          <div key={successTarget.targetId} className="h-full min-w-[100%] flex flex-col items-center">
            <TargetSceneTextarea
              choice={choice}
              target={successTarget}
              onOpenChange={setMenuOpen}
              placeholder="Success scene text"
            >
              <Scene.Badge position="topLeft" className="size-6 translate-x-full ml-1.5">
                <Check className="size-4" />
              </Scene.Badge>

              <Scene.Button
                showOnHoverOnly
                position="middleRight"
                className="size-6"
                onClick={handleNewTarget(successTarget.targetType)}
              >
                <Plus className="size-4" />
              </Scene.Button>
            </TargetSceneTextarea>
          </div>
        ))}
      </div>
      <div className="h-full w-1/2 whitespace-nowrap flex gap-2 overflow-x-auto box-content pb-5">
        {Object.values(failTargets).map(failTarget => (
          <div key={failTarget.targetId} className="h-full min-w-[100%] flex flex-col items-center">
            <TargetSceneTextarea
              choice={choice}
              target={failTarget}
              onOpenChange={setMenuOpen}
              placeholder="Fail scene text"
            >
              <Scene.Badge position="topLeft" className="size-6 translate-x-full ml-1.5">
                <Check className="size-4" />
              </Scene.Badge>

              <Scene.Button
                showOnHoverOnly
                position="middleRight"
                className="size-6"
                onClick={handleNewTarget(failTarget.targetType)}
              >
                <Plus className="size-4" />
              </Scene.Button>
            </TargetSceneTextarea>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Scene.Root menuOpen={menuOpen} className="flex flex-col items-center gap-2 w-96 pb-2 h-[30rem]">
      {!story.readOnly && (
        <StoryTreeChoiceMenu
          choice={choice}
          onOpenChange={setMenuOpen}
        />
      )}

      {choiceTextarea}
      {hasCheckFailBranching ? splitTargetSceneTextarea : monoTargetSceneTextareas}
    </Scene.Root>
  );
}

export interface StoryTreeSceneChoiceProps {
  choiceId: string;
  index: number;
}
