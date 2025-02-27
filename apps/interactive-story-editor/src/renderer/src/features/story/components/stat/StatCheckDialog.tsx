import { useSelector } from '@xstate/store/react';
import { Button, Dialog, Select } from '@zougui/react.ui';
import { storyStore } from '../../story.store';
import { Input } from '@renderer/components/Input';
import { useState } from 'react';
import { isNumber } from 'radash';
import { Label } from '@renderer/components/Label';
import { SceneChoice } from '@zougui/interactive-story.story';
import { useStoryTreeContext } from '../StoryTree/context';

export const failEffectTypes = {
  disable: 'disable',
  hide: 'hide',
  branch: 'branch',
} as const;

export type FailEffectType = keyof typeof failEffectTypes;

export const failEffectTypeLabels: Record<FailEffectType, string> = {
  branch: 'Branch',
  disable: 'Disable',
  hide: 'Hide',
};

// TODO use useAppForm
export const StatCheckDialog = ({ choiceId, open, onClose, defaultValues }: StatCheckDialogProps) => {
  const story = useStoryTreeContext();
  const stats = useSelector(storyStore, state => state.context.data.stats);
  const [statChecks, setStatChecks] = useState<Record<string, string | number>>(defaultValues?.stats ?? {});
  const [checkFailEffect, setCheckFailEffect] = useState<FailEffectType>(defaultValues?.failEffect ?? failEffectTypes.branch);

  const handleStatCheckChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    if (value && !isNumber(Number(value)) && value !== '-') {
      return;
    }

    setStatChecks(prevStatChecks => {
      const updatedStatChecks = { ...prevStatChecks };

      if (value) {
        updatedStatChecks[id] = value;
      } else {
        delete updatedStatChecks[id];
      }

      return updatedStatChecks;
    });
  }

  const close = (newDefaultValues?: StatCheckDialogProps['defaultValues']) => {
    const values = newDefaultValues ?? defaultValues;

    onClose();
    setStatChecks(values?.stats ?? {});
    setCheckFailEffect(values?.failEffect ?? failEffectTypes.branch);
  }

  const handleSubmit = () => {
    if (Object.keys(statChecks).length) {
      const stats: Record<string, number> = {};

      for (const [id, value] of Object.entries(statChecks)) {
        stats[id] = Number(value);
      }

      close({
        stats,
        failEffect: checkFailEffect,
      });
      story.updateChoiceStatCheck({
        stats,
        failEffect: checkFailEffect,
        choiceId,
      });
    }
  }

  const handleRemoveStatCheck = () => {
    story.removeChoiceStatCheck({ choiceId });
    close({
      stats: {},
      failEffect: failEffectTypes.branch,
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={() => close()}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Check Stats</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {Object.values(stats).map(stat => (
                <div key={stat.id} className="flex items-center gap-4">
                  <span className="min-w-20" style={{ color: stat.color }}>{stat.name}</span>

                  <Input
                    value={statChecks[stat.id] ?? ''}
                    onChange={handleStatCheckChange(stat.id)}
                    className="w-16"
                  />
                </div>
              ))}
            </div>

            <span className="flex flex-col space-y-2">
              <Label>Fail effect</Label>

              <Select.Root value={checkFailEffect} onValueChange={value => setCheckFailEffect(value as FailEffectType)}>
                <Select.Trigger className="w-32 flex justify-between">
                  <Select.Value />
                </Select.Trigger>

                <Select.Content>
                  {Object.values(failEffectTypes).map(effectType => (
                    <Select.Item
                      key={effectType}
                      value={effectType}
                    >
                      {failEffectTypeLabels[effectType]}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </span>
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Button onClick={handleSubmit}>Confirm</Button>

          {defaultValues && (
            <Button onClick={handleRemoveStatCheck} className="bg-destructive text-foreground hover:bg-destructive">
              Remove stat check
            </Button>
          )}

          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface StatCheckDialogProps {
  choiceId: string;
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<SceneChoice['check']>;
}
