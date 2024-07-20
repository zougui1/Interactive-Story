import { useHotkeys } from 'react-hotkeys-hook';

import { Electron } from '@zougui/interactive-story.electron-api';

import { Menu } from '@renderer/components/Menu';
import { useAppDispatch } from '@renderer/store';

import { openStory } from '../storySlice';

enum ShortcutMap {
  OpenStory = 'ctrl+o',
}

export const FileMenu = () => {
  const dispatch = useAppDispatch();

  const handleOpen = async () => {
    dispatch(openStory());
  }

  useHotkeys(ShortcutMap.OpenStory, handleOpen);

  return (
    <Menu.Root>
      <Menu.Button>File</Menu.Button>

      <Menu.Content>
        <Menu.Group>
          <Menu.Item
            disabled={!Electron.isAvailable}
            onClick={handleOpen}
            shortcut={ShortcutMap.OpenStory}
          >
            Open Story
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
