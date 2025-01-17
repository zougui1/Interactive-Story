import { useState } from 'react';
import { Trash2, ArrowUpToLine, EllipsisVertical, Split, Copy } from 'lucide-react';

import { ChoiceType, type SceneChoice } from '@zougui/interactive-story.story';

import { Dropdown } from '@renderer/components/Dropdown';
import { copyText } from '@renderer/utils';

import { useStoryTreeContext } from './context';
import { Scene } from '../Scene';
import { ScenePickerDialog } from '../ScenePickerDialog';
import { rootId } from '../../defaultStoryData';

export const StoryTreeSceneChoiceMenu = ({ choice, onOpenChange }: StoryTreeSceneChoiceMenuProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const story = useStoryTreeContext();

  return (
    <>
      <ScenePickerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        story={{
          ...story,
          sceneIdStack: [rootId],
        }}
        defaultSceneId={choice.type === ChoiceType.Jump ? choice.sceneId : undefined}
        onSubmit={sceneId => story.setChoiceJump(choice.id, sceneId)}
      />

      <Dropdown.Root onOpenChange={onOpenChange}>
        <Dropdown.Trigger asChild>
          <Scene.Button position="topRight" showOnHoverOnly>
            <EllipsisVertical className="w-4" />
          </Scene.Button>
        </Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item onClick={() => copyText(choice.sceneId)}>
            <Copy className="w-4 mr-2" />
            <span>Copy scene ID</span>
          </Dropdown.Item>

          {choice.type !== ChoiceType.Branch && (
            <Dropdown.Item onClick={() => story.setChoiceBranch(choice.id)}>
              <Split className="w-4 mr-2" />
              <span>Branch scene</span>
            </Dropdown.Item>
          )}

          {choice.type !== ChoiceType.Jump && (
            <Dropdown.Item
              onClick={() => setOpenDialog(true)}
            >
              <ArrowUpToLine className="w-4 mr-2" />
              <span>Jump to scene</span>
            </Dropdown.Item>
          )}

          {choice.type === ChoiceType.Jump && (
            <Dropdown.Item
              onClick={() => setOpenDialog(true)}
            >
              <ArrowUpToLine className="w-4 mr-2" />
              <span>Jump to another scene</span>
            </Dropdown.Item>
          )}

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

export interface StoryTreeSceneChoiceMenuProps {
  choice: SceneChoice;
  onOpenChange: (open: boolean) => void;
}
