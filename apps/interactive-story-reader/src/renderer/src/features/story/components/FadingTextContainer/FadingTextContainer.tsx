import { useEffect, useRef } from 'react';

import { useWindowEvent } from '@renderer/hooks';

import { fadeElement } from './utils';

export const FadingTextContainer = (props: FadingTextContainerProps) => {
  const textRef = useRef<HTMLDivElement | null>(null);

  const handleOpacity = () => {
    const textElement = textRef.current;
    if (!textElement) return;

    textElement.childNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        fadeElement(node);
      }
    });
  }

  useEffect(handleOpacity);
  useWindowEvent('scroll', handleOpacity);

  return (
    <div {...props} ref={textRef} />
  );
}

export interface FadingTextContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
