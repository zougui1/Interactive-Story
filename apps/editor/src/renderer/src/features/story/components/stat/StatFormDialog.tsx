import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useSelector } from '@xstate/store/react';

import { Form, Dialog, Button, Checkbox } from '@zougui/react.ui';
import { statSchema } from '@zougui/interactive-story.story';

import { useAppForm } from '@renderer/hooks';

import { storyStore } from '../../story.store';

export const StatFormDialog = ({ defaultStatId, children }: StatFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const defaultStat = useSelector(storyStore, state => defaultStatId ? state.context.data.stats[defaultStatId] : undefined);

  const form = useAppForm({
    schema: statSchema.pick({ name: true, color: true, startValue: true, hidden: true }),
    defaultValues: {
      name: defaultStat?.name ?? '',
      color: defaultStat?.color ?? '#ffffff',
      startValue: defaultStat?.startValue ?? 0,
      hidden: defaultStat?.hidden ?? false,
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
              <Form.Field
                control={form.control}
                name="hidden"
                render={({ field }) => (
                  <Form.Item className="flex items-center gap-2">
                    <Form.Label>Hide</Form.Label>

                    <Form.Control>
                      <Checkbox
                        {...field}
                        className="!mt-0 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        checked={field.value}
                        value={undefined}
                        onCheckedChange={field.onChange as any}
                      />
                    </Form.Control>
                  </Form.Item>
                )}
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
