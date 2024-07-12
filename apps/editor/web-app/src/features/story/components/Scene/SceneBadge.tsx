import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Slot } from '@radix-ui/react-slot';

import { useSceneContext } from './context';

const badge = tv({
  base: 'p-0 text-2xl absolute size-9 rounded-full border border-slate-300 flex items-center justify-center bg-slate-900',

  variants: {
    position: {
      topMiddle: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      topRight: 'top-0 right-2 -translate-y-1/2',
      topLeft: 'top-0 left-2 -translate-y-1/2',
      bottomMiddle: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    },
  },
});

export const SceneBadge = forwardRef<HTMLSpanElement, SceneBadgeProps>(({ className, asChild, position, showOnHoverOnly, ...rest }, ref) => {
  const { hovered } = useSceneContext();
  const Comp = asChild ? Slot : 'span';


  if (showOnHoverOnly && !hovered) {
    return null;
  }

  return (
    <Comp
      {...rest}
      ref={ref}
      className={badge({ position, className })}
    />
  );
});

SceneBadge.displayName = 'SceneBadge';

export interface SceneBadgeProps extends VariantProps<typeof badge> {
  showOnHoverOnly?: boolean;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}
