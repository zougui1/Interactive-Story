import { useState } from 'react';

import { Button, Dialog, Tabs } from '@zougui/react.ui';
import type { Story } from '@zougui/interactive-story.story';

import { Input } from '@renderer/components/Input';

import { StoryTree } from '../StoryTree';

enum TabType {
  SceneId = 'SceneId',
  Tree = 'Tree',
}

export const ScenePickerDialog = ({ open, defaultSceneId = '', onClose, onSubmit, story }: ScenePickerDialogProps) => {
  const [tabValue, setTabValue] = useState(TabType.Tree);
  const [inputSceneId, setInputSceneId] = useState(defaultSceneId);
  const [treeSceneId, setTreeSceneId] = useState(story.sceneIdStack[story.sceneIdStack.length - 1]);

  const inputSceneIdExists = inputSceneId in story.scenes;

  const handleSubmit = () => {
    const handlers: Record<TabType, () => void> = {
      [TabType.SceneId]: () => onSubmit(inputSceneId),
      [TabType.Tree]: () => onSubmit(treeSceneId),
    };

    handlers[tabValue]();
  }

  const handleClose = () => {
    onClose();
    setInputSceneId(defaultSceneId);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content className="max-w-7xl max-h-[calc(100vh-40px)] flex flex-col">
        <Dialog.Header>
          <Dialog.Title>Pick a scene to jump to</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col items-center space-y-8">
          <Tabs.Root
            onValueChange={v => setTabValue(v as TabType)}
            value={tabValue}
            className="flex flex-col items-center"
          >
            <Tabs.List className="mb-8">
              {/**
               * the focus on mount is required to prevent the default tab content
               * to be auto focused when dialog opens
               */}
              <Tabs.Trigger ref={e => e?.focus()} value={TabType.Tree}>Scene tree</Tabs.Trigger>
              <Tabs.Trigger value={TabType.SceneId}>Scene ID</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value={TabType.Tree}>
              <div>
                <StoryTree
                  readOnly
                  defaultStory={story}
                  onCurrentSceneChange={sceneId => setTreeSceneId(sceneId)}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value={TabType.SceneId}>
              <div>
                <Input
                  className="w-[25ch]"
                  label="Scene ID"
                  value={inputSceneId}
                  onChange={e => setInputSceneId(e.currentTarget.value)}
                />
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>
              Cancel
            </Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button
              disabled={tabValue === TabType.SceneId && !inputSceneIdExists}
              onClick={handleSubmit}
            >
              Choose scene
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface ScenePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (sceneId: string) => void;
  story: Story;
  defaultSceneId?: string;
}
