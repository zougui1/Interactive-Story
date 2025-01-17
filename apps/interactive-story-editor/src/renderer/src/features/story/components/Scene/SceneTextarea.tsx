import { forwardRef } from 'react';

import { Textarea, type TextareaProps } from '@renderer/components/Textarea';
import { cn } from '@renderer/utils';

export const SceneTextarea = forwardRef<HTMLTextAreaElement, SceneTextareaProps>(({ className, ...rest }, ref) => {
  return (
    <Textarea
      placeholder="Scene text"
      {...rest}
      ref={ref}
      className={cn('h-full resize-none', className)}
    />
  );
});

SceneTextarea.displayName = 'SceneTextarea';

export interface SceneTextareaProps extends TextareaProps {

}
