import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button, type ButtonProps } from '~/components/Button';
import { useStoryPartContext } from './context';

const button = tv({
  base: 'p-0 text-2xl absolute size-9 rounded-full border border-slate-300 flex items-center justify-center bg-slate-900',

  variants: {
    position: {
      topMiddle: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      topRight: 'top-0 right-2 -translate-y-1/2',
      bottomMiddle: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    },
  },
});

export const StoryPartButton = forwardRef<HTMLButtonElement, StoryPartButtonProps>(({ className, position, showOnHoverOnly, ...rest }, ref) => {
  const { hovered } = useStoryPartContext();

  if (showOnHoverOnly && !hovered) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      {...rest}
      ref={ref}
      className={button({ position, className })}
    />
  );
});

StoryPartButton.displayName = 'StoryPartButton';

export interface StoryPartButtonProps extends VariantProps<typeof button>, ButtonProps {
  showOnHoverOnly?: boolean;
}
