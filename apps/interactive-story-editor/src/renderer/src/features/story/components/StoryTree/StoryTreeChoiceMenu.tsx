import { useDeferredValue, useState } from 'react';
import { Trash2, EllipsisVertical, ChartBarIncreasing } from 'lucide-react';

import { type SceneChoice } from '@zougui/interactive-story.story';

import { Dropdown } from '@renderer/components/Dropdown';

import { useStoryTreeContext } from './context';
import { Scene } from '../Scene';
import { useSelector } from '@xstate/store/react';
import { storyStore } from '../../story.store';
import { StatCheckDialog } from '../stat/StatCheckDialog';

export const StoryTreeChoiceMenu = ({ choice, onOpenChange }: StoryTreeChoiceMenuProps) => {
  const [openStatCheckDialog, setOpenStatCheckDialog] = useState(false);
  const story = useStoryTreeContext();
  const hasStats = useSelector(storyStore, state => Object.keys(state.context.data.stats).length > 0);

  // deferring the dialogs' open state fixes a bug that causes the dialogs to make the whole app to bug out
  const deferredOpenStatCheckDialog = useDeferredValue(openStatCheckDialog);

  return (
    <>
      <StatCheckDialog
        choiceId={choice.id}
        open={deferredOpenStatCheckDialog}
        onClose={() => setOpenStatCheckDialog(false)}
        defaultValues={choice.check}
      />

      <Dropdown.Root onOpenChange={onOpenChange}>
        <Dropdown.Trigger asChild>
          <Scene.Button position="topRight" showOnHoverOnly>
            <EllipsisVertical className="w-4" />
          </Scene.Button>
        </Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item
            disabled={!hasStats}
            onClick={() => setOpenStatCheckDialog(true)}
          >
            <ChartBarIncreasing className="w-4 mr-2" />
            <span>Check stats</span>
          </Dropdown.Item>

          <Dropdown.Separator />

          <Dropdown.Item onClick={() => story.deleteChoice(choice.id)}>
            <Trash2 className="w-4 text-red-500 mr-2" />
            <span>Delete choice</span>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}

export interface StoryTreeChoiceMenuProps {
  choice: SceneChoice;
  onOpenChange: (open: boolean) => void;
}
