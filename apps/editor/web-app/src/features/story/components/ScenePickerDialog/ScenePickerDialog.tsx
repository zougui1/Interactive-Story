import { useState } from 'react';

import { Dialog } from '~/components/Dialog';
import { Input } from '~/components/Input';
import { Button } from '~/components/Button';
import { Tabs } from '~/components/Tabs';

import { StoryTree } from '../StoryTree';
import type { SceneReference, Scene } from '../../types';

enum TabType {
  SceneId = 'SceneId',
  Tree = 'Tree',
}

export const ScenePickerDialog = ({ open, defaultSceneId = '', onClose, onSubmit, scenes, sceneIdStack, sceneReferences }: ScenePickerDialogProps) => {
  const [tabValue, setTabValue] = useState(TabType.SceneId);
  const [inputSceneId, setInputSceneId] = useState(defaultSceneId);
  const [treeSceneId, setTreeSceneId] = useState(sceneIdStack[sceneIdStack.length - 1]);

  const inputSceneIdExists = inputSceneId in scenes;

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
      <Dialog.Content className="max-w-5xl">
        <Dialog.Header>
          <Dialog.Title>Pick a scene to jump to</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col items-center space-y-8">
          <Tabs.Root onValueChange={setTabValue} value={tabValue} className="flex flex-col items-center">
            <Tabs.List className="mb-8">
              <Tabs.Trigger value={TabType.SceneId}>Scene ID</Tabs.Trigger>
              <Tabs.Trigger value={TabType.Tree}>Scene tree</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value={TabType.SceneId}>
              <div>
                <Input
                  ref={e => e?.focus()}
                  className="w-[25ch]"
                  label="Scene ID"
                  value={inputSceneId}
                  onChange={e => setInputSceneId(e.currentTarget.value)}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value={TabType.Tree}>
              <div>
                <StoryTree
                  readOnly
                  defaultScenes={scenes}
                  defaultSceneIdStack={sceneIdStack}
                  defaultSceneReferences={sceneReferences}
                  onCurrentSceneChange={scene => setTreeSceneId(scene.id)}
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
  scenes: Record<string, Scene>;
  sceneReferences: Record<string, SceneReference>;
  sceneIdStack: string[];
  defaultSceneId?: string;
}
