import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from '@xstate/store/react';

import { Form } from '@zougui/react.ui';
import { statSchema } from '@zougui/interactive-story.story';

import { Dialog } from '@renderer/components/Dialog';
import { Button } from '@renderer/components/Button';
import { useAppForm } from '@renderer/hooks';

import { storyStore } from '../../story.store';

export const StatFormDialog = ({ defaultStatId, children }: StatFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const defaultStat = useSelector(storyStore, state => defaultStatId ? state.context.data.stats[defaultStatId] : undefined);

  const form = useAppForm({
    schema: statSchema.pick({ name: true, color: true, startValue: true }),
    defaultValues: {
      name: defaultStat?.name ?? '',
      color: defaultStat?.color ?? '#ffffff',
      startValue: defaultStat?.startValue ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    storyStore.trigger.updateStat({
      stat: {
        ...data,
        id: defaultStat?.id ?? nanoid(),
        value: data.startValue,
      },
    });
    setOpen(false);
    form.reset();
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Content>
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>New Stat</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="flex flex-col gap-4">
              <Form.Input
                control={form.control}
                name="name"
                label="Name"
                style={{ color: form.watch('color') }}
              />
              <Form.Input
                control={form.control}
                type="color"
                name="color"
                label="Color"
                className="cursor-pointer"
              />
              <Form.Input
                control={form.control}
                name="startValue"
                label="Start value"
              />
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleSubmit}>
                {defaultStat ? 'Update stat' : 'Create stat'}
              </Button>

              <Dialog.Close asChild>
                <Button
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface StatFormDialogProps {
  children: React.ReactNode;
  defaultStatId?: string;
}
