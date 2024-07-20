import { useHotkeys } from 'react-hotkeys-hook';

import { Electron } from '@zougui/interactive-story.electron-api';

import { Menu } from '@renderer/components/Menu';
import { useAppDispatch, useAppSelector } from '@renderer/store';

import { openStory, saveStory, newStory } from '../storySlice';

enum ShortcutMap {
  NewStory = 'ctrl+n',
  OpenStory = 'ctrl+o',
  SaveStory = 'ctrl+s',
  SaveAs = 'ctrl+shift+s',
}

export const FileMenu = () => {
  const dispatch = useAppDispatch();
  const story = useAppSelector((state) => state.story.data);

  const handleNew = () => {
    dispatch(newStory());
  };

  const handleSave = () => {
    dispatch(saveStory({ overwrite: true }));
  };

  const handleSaveAs = () => {
    dispatch(saveStory());
  };

  const handleOpen = async () => {
    dispatch(openStory());
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
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
