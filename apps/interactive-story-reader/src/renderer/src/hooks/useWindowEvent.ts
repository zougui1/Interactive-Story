import { useEffect, useRef } from 'react';

export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void
) => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => {
      listenerRef.current(event);
    }

    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    }
  }, [type]);
}
