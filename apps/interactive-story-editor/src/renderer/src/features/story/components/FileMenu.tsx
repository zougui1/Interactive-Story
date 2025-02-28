import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from '@xstate/store/react';

import { Electron } from '@zougui/interactive-story.electron-api';

import { Menu } from '@renderer/components/Menu';

import { storyStore } from '../story.store';

enum ShortcutMap {
  NewStory = 'ctrl+n',
  OpenStory = 'ctrl+o',
  SaveStory = 'ctrl+s',
  SaveAs = 'ctrl+shift+s',
}

export const FileMenu = () => {
  const story = useSelector(storyStore, (state) => state.context.data);

  const handleNew = () => {
    storyStore.trigger.newStory();
  };

  const handleSave = () => {
    storyStore.trigger.saveStory({ overwrite: true });
  };

  const handleSaveAs = () => {
    storyStore.trigger.saveStory({});
  };

  const handleExportHtml = () => {
    storyStore.trigger.exportHtml();
  };

  const handleOpen = async () => {
    storyStore.trigger.openStory();
  };

  useHotkeys(ShortcutMap.NewStory, handleNew);
  useHotkeys(ShortcutMap.OpenStory, handleOpen);
  useHotkeys(ShortcutMap.SaveStory, handleSave);
  useHotkeys(ShortcutMap.SaveAs, handleSaveAs);

  return (
    <Menu.Root>
      <Menu.Button>File</Menu.Button>

      <Menu.Content>
        <Menu.Group>
          <Menu.Item onClick={handleNew} shortcut={ShortcutMap.NewStory}>
            New Story
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.Item
            disabled={!Electron.isAvailable}
            onClick={handleOpen}
            shortcut={ShortcutMap.OpenStory}
          >
            Open Story
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.Item
            disabled={!Electron.isAvailable || !story}
            onClick={handleSave}
            shortcut={ShortcutMap.SaveStory}
          >
            Save Story
          </Menu.Item>

          <Menu.Item
            disabled={!Electron.isAvailable || !story}
            onClick={handleSaveAs}
            shortcut={ShortcutMap.SaveAs}
          >
            Save As
          </Menu.Item>

          <Menu.Item
            disabled={!Electron.isAvailable || !story}
            onClick={handleExportHtml}
          >
            Export As HTML
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
