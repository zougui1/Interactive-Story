import { Menu } from '@renderer/components/Menu';
import { useAppDispatch, useAppSelector } from '@renderer/store';

import { changeFadingText } from '../storySlice';

export const ViewMenu = () => {
  const fadingText = useAppSelector(state => state.story.settings.fadingText);
  const dispatch = useAppDispatch();

  const handleOpen = async (checked: boolean) => {
    dispatch(changeFadingText(checked));
  }

  return (
    <Menu.Root>
      <Menu.Button>View</Menu.Button>

      <Menu.Content>
        <Menu.Group>
          <Menu.CheckboxItem
            onCheckedChange={handleOpen}
            checked={fadingText}
          >
            Fading text
          </Menu.CheckboxItem>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
