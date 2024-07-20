import { Button } from '@renderer/components/Button';
import { useAppDispatch } from '@renderer/store';

import { openStory } from '../storySlice';

export const NoStory = () => {
  const dispatch = useAppDispatch();

  const handleOpen = async () => {
    dispatch(openStory());
  }

  return (
    <Button onClick={handleOpen}>Open Story</Button>
  );
}
