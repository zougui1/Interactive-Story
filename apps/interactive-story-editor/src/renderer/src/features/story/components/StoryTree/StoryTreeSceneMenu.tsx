import { useDeferredValue, useState } from 'react';
import { ArrowUpToLine, EllipsisVertical, Split, Copy, ChartBarIncreasing } from 'lucide-react';
import { useSelector } from '@xstate/store/react';

import { SceneChoiceTarget, SceneChoiceTargetType, type SceneChoice } from '@zougui/interactive-story.story';

import { Dropdown } from '@renderer/components/Dropdown';
import { copyText } from '@renderer/utils';

import { Scene } from '../Scene';
import { ScenePickerDialog } from '../ScenePickerDialog';
import { StatIncrementDecrementDialog } from '../stat/StatIncrementDecrementDialog';
import { rootId } from '../../defaultStoryData';
import { storyStore } from '../../story.store';

export const StoryTreeSceneMenu = ({ choice, target, onOpenChange }: StoryTreeSceneMenuProps) => {
  const [openScenePickerDialog, setOpenScenePickerDialog] = useState(false);
  const [openStatIncrementDecrementDialog, setOpenStatIncrementDecrementDialog] = useState(false);
  const storyData = useSelector(storyStore, state => state.context.data);
  const hasStats = useSelector(storyStore, state => Object.keys(state.context.data.stats).length > 0);

  // deferring the dialogs' open state fixes a bug that causes the dialogs to make the whole app to bug out
  const deferredOpenScenePickerDialog = useDeferredValue(openScenePickerDialog);
  const deferredOpenStatIncrementDecrementDialog = useDeferredValue(openStatIncrementDecrementDialog);

  return (
    <>
      <ScenePickerDialog
        open={deferredOpenScenePickerDialog}
        onClose={() => setOpenScenePickerDialog(false)}
        story={{
          ...storyData,
          sceneIdStack: [rootId],
        }}
        defaultSceneId={target.type === SceneChoiceTargetType.Jump ? target.sceneId : undefined}
        onSubmit={sceneId => storyStore.trigger.setChoiceJump({ choiceId: choice.id, targetId: target.id, sceneId: sceneId })}
      />

      <StatIncrementDecrementDialog
        choiceId={choice.id}
        targetId={target.id}
        open={deferredOpenStatIncrementDecrementDialog}
        onClose={() => setOpenStatIncrementDecrementDialog(false)}
        defaultValues={target.statIncrements}
      />

      <Dropdown.Root onOpenChange={onOpenChange}>
        <Dropdown.Trigger asChild>
          <Scene.Button position="topRight" showOnHoverOnly>
            <EllipsisVertical className="w-4" />
          </Scene.Button>
        </Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item onClick={() => copyText(target.sceneId)}>
            <Copy className="w-4 mr-2" />
            <span>Copy scene ID</span>
          </Dropdown.Item>

          {target.type !== SceneChoiceTargetType.Branch && (
            <Dropdown.Item onClick={() => storyStore.trigger.setChoiceBranch({ choiceId: choice.id, targetId: target.id })}>
              <Split className="w-4 mr-2" />
              <span>Branch scene</span>
            </Dropdown.Item>
          )}

          {target.type !== SceneChoiceTargetType.Jump && (
            <Dropdown.Item
              onClick={() => setOpenScenePickerDialog(true)}
            >
              <ArrowUpToLine className="w-4 mr-2" />
              <span>Jump to scene</span>
            </Dropdown.Item>
          )}

          {target.type === SceneChoiceTargetType.Jump && (
            <Dropdown.Item
              onClick={() => setOpenScenePickerDialog(true)}
            >
              <ArrowUpToLine className="w-4 mr-2" />
              <span>Jump to another scene</span>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            disabled={!hasStats}
            onClick={() => setOpenStatIncrementDecrementDialog(true)}
          >
            <ChartBarIncreasing className="w-4 mr-2" />
            <span>Increment/decrement stats</span>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}

export interface StoryTreeSceneMenuProps {
  choice: SceneChoice;
  target: SceneChoiceTarget;
  onOpenChange: (open: boolean) => void;
}
