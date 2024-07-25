import { useEffect, useRef } from 'react';

import { useWindowEvent } from '@renderer/hooks';
import { useAppDispatch, useAppSelector } from '@renderer/store';
import { scrollToBottom } from '@renderer/utils';

import { changeZoom } from '../storySlice';

const isWindowScrollAtBottom = (): boolean => {
  return (window.scrollY + window.innerHeight) >= document.body.scrollHeight;
}

export const useZoom = (): number => {
  const windowScrollRef = useRef(isWindowScrollAtBottom());
  const zoom = useAppSelector(state => state.story.settings.zoom);
  const dispatch = useAppDispatch();

  useWindowEvent('wheel', e => {
    if (!e.ctrlKey) {
      return;
    }

    windowScrollRef.current = isWindowScrollAtBottom();
    const zoomDirection = e.deltaY < 0 ? 'in' : 'out';
    dispatch(changeZoom(zoomDirection));
  });

  useEffect(() => {
    if (windowScrollRef.current) {
      scrollToBottom();
    }
  }, [zoom]);

  return zoom;
}
