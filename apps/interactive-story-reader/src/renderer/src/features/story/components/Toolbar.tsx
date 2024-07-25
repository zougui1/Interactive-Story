import { Button } from '@renderer/components/Button';
import { useAppDispatch, useAppSelector } from '@renderer/store';

import { resetZoom } from '../storySlice';

export const Toolbar = () => {
  const hasStory = useAppSelector(state => Boolean(state.story.data));
  const zoom = useAppSelector(state => state.story.settings.zoom);
  const dispatch = useAppDispatch();

  const handleResetZoom = () => {
    dispatch(resetZoom());
  }

  return (
    <div className="pr-4 h-full flex items-center">
      {hasStory && zoom !== 100 && (
        <Button className="px-1.5 h-7" onClick={handleResetZoom}>{zoom}%</Button>
      )}
    </div>
  );
}
