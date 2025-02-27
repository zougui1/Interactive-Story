import { useSelector } from '@xstate/store/react';
import { Button, Dialog } from '@zougui/react.ui';
import { storyStore } from '../../story.store';
import { Input } from '@renderer/components/Input';
import { useState } from 'react';
import { isNumber } from 'radash';
import { SceneChoiceTarget } from '@zougui/interactive-story.story';
import { useStoryTreeContext } from '../StoryTree/context';

// TODO use useAppForm
export const StatIncrementDecrementDialog = ({ choiceId, targetId, open, onClose, defaultValues }: StatIncrementDecrementDialogProps) => {
  const story = useStoryTreeContext();
  const stats = useSelector(storyStore, state => state.context.data.stats);
  const [statIncrements, setStatIncrements] = useState<Record<string, string | number>>(defaultValues ?? {});

  const handleStatIncrementChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    if (value && !isNumber(Number(value)) && value !== '-') {
      return;
    }

    setStatIncrements(prevStatIncrements => {
      const updatedStatIncrements = { ...prevStatIncrements };

      if (value) {
        updatedStatIncrements[id] = value;
      } else {
        delete updatedStatIncrements[id];
      }

      return updatedStatIncrements;
    });
  }

  const close = () => {
    onClose();
    setStatIncrements(defaultValues ?? {});
  }

  const handleSubmit = () => {
    if (Object.keys(statIncrements).length) {
      const stats: Record<string, number> = {};

      for (const [id, value] of Object.entries(statIncrements)) {
        stats[id] = Number(value);
      }

      story.updateChoiceTargetStatIncrements({
        statIncrements: stats,
        choiceId,
        targetId,
      });
      close();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Increment/Decrement Stats</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-4">
            {Object.values(stats).map(stat => (
              <div key={stat.id} className="flex items-center gap-4">
                <span className="min-w-20" style={{ color: stat.color }}>{stat.name}</span>

                <Input
                  value={statIncrements[stat.id] ?? ''}
                  onChange={handleStatIncrementChange(stat.id)}
                  className="w-16"
                />
              </div>
            ))}
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button onClick={handleSubmit}>Confirm</Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface StatIncrementDecrementDialogProps {
  choiceId: string;
  targetId: string;
  open: boolean;
  onClose: () => void;
  defaultValues?: SceneChoiceTarget['statIncrements'];
}
