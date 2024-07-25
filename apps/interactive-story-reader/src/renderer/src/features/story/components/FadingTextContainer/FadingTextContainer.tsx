import { useEffect, useRef } from 'react';

import { useWindowEvent } from '@renderer/hooks';

import { fadeElement } from './utils';

export const FadingTextContainer = ({ zoom, disabled, ...rest }: FadingTextContainerProps) => {
  const textRef = useRef<HTMLDivElement | null>(null);

  const handleOpacity = () => {
    const textElement = textRef.current;

    if (!textElement) return;

    const childElements = [...textElement.childNodes].filter(node => {
      return node instanceof HTMLElement;
    }) as HTMLElement[];

    for (const childElement of childElements) {
      if (disabled) {
        childElement.style.opacity = '';
      } else {
        fadeElement(childElement, { zoom });
      }
    }
  }

  useEffect(handleOpacity);
  useWindowEvent('scroll', handleOpacity);

  return (
    <div {...rest} ref={textRef} />
  );
}

export interface FadingTextContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  zoom?: number;
  children?: React.ReactNode;
}
