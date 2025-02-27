import { forwardRef, useState } from 'react';

import { Textarea, type TextareaProps } from '@renderer/components/Textarea';
import { cn } from '@renderer/utils';
import { SceneButton } from './SceneButton';
import { Eye } from 'lucide-react';
import { AppMarkdown } from '@renderer/components/AppMarkdown';

export const SceneTextarea = forwardRef<HTMLTextAreaElement, SceneTextareaProps>(({ className, value, children, ...rest }, ref) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={cn('relative w-full h-full', className)}>
      <SceneButton
        position="topMiddle"
        onClick={() => setShowPreview(b => !b)}
      >
        <Eye className="w-6 h-6" />
      </SceneButton>

      {children}

      {!showPreview && (
        <Textarea
          placeholder="Scene text"
          {...rest}
          value= {value}
          ref={ref}
          className="h-full pt-6 resize-none"
        />
      )}

      {showPreview && (
        <AppMarkdown
          className="w-full h-full px-3 pt-6 pb-2 bg-background rounded-md border border-input"
          forceNewLines
        >
          {String(value)}
        </AppMarkdown>
      )}
    </div>
  );
});

SceneTextarea.displayName = 'SceneTextarea';

export interface SceneTextareaProps extends TextareaProps {

}
