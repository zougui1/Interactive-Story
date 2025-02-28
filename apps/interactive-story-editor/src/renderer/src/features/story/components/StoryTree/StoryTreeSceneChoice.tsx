import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useSelector } from '@xstate/store/react';

import { useStoryTreeContext } from './context';
import { StoryTreeChoiceMenu } from './StoryTreeChoiceMenu';
import { BadgeList } from './BadgeList';
import { Scene } from '../Scene';
import { failEffectTypes } from '../stat/StatCheckDialog';
import { storyStore } from '../../story.store';
import { TargetSceneTextarea } from './TargetSceneTextarea';
import { reorderArray } from '@renderer/utils';

export interface BadgeProps {
  children?: React.ReactNode;
  color?: string;
}

export const StoryTreeSceneChoice = ({ choiceId }: StoryTreeSceneChoiceProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const story = useStoryTreeContext();
  const choice = useSelector(storyStore, state => state.context.data.choices[choiceId]);
  const stats = useSelector(storyStore, state => state.context.data.stats);

  const successTarget = choice.targets.success;
  const failTarget = choice.targets.fail;

  const hasCheckFailBranching = choice.check?.failEffect === failEffectTypes.branch;

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

  const monoTargetSceneTextarea = (
    <div className="h-3/5 w-full flex flex-col items-center">
      <TargetSceneTextarea
        choice={choice}
        target={successTarget}
        onOpenChange={setMenuOpen}
        placeholder="Scene text"
      />
    </div>
  );

  const splitTargetSceneTextarea = (
    <div className="flex gap-1 h-3/5 w-full">
      <div className="flex flex-col items-center w-1/2">
        <TargetSceneTextarea
          choice={choice}
          target={successTarget}
          onOpenChange={setMenuOpen}
          placeholder="Success scene text"
        >
          <Scene.Badge position="topLeft" className="size-6 translate-x-full ml-1.5">
            <Check className="size-4" />
          </Scene.Badge>
        </TargetSceneTextarea>
      </div>
      <div className="flex flex-col items-center w-1/2">
        {failTarget && (
          <TargetSceneTextarea
            choice={choice}
            target={failTarget}
            onOpenChange={setMenuOpen}
            placeholder="Fail scene text"
          >
            <Scene.Badge position="topLeft" className="size-6 translate-x-full ml-1.5">
              <X className="size-4" />
            </Scene.Badge>
          </TargetSceneTextarea>
        )}
      </div>
    </div>
  );

  return (
    <Scene.Root menuOpen={menuOpen} className="flex flex-col items-center gap-2 w-96 h-[30rem]">
      {!story.readOnly && (
        <StoryTreeChoiceMenu
          choice={choice}
          onOpenChange={setMenuOpen}
        />
      )}

      {choiceTextarea}
      {hasCheckFailBranching ? splitTargetSceneTextarea : monoTargetSceneTextarea}
    </Scene.Root>
  );
}

export interface StoryTreeSceneChoiceProps {
  choiceId: string;
  index: number;
}
