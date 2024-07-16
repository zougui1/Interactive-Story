import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { tv } from 'tailwind-variants';

const labelVariants = tv({
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
});

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={labelVariants({ className })}
      {...props}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export interface LabelProps extends LabelPrimitive.LabelProps {

}
