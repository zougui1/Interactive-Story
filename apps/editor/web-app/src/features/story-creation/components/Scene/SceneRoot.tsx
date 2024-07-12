import { useState } from 'react';

import { Textarea } from '~/components/Textarea';
import { cn } from '~/utils';

import { SceneProvider } from './context';

export const SceneRoot = ({ text, onChange, children, className, menuOpen }: SceneRootProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <SceneProvider hovered={hovered || Boolean(menuOpen)}>
      <div
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn('relative size-64 border border-slate-300 rounded py-7 px-4 bg-slate-900', className)}
      >
        {children}

        <Textarea className="h-full" value={text} onChange={onChange} />
      </div>

    </SceneProvider>
  );
}

export interface SceneRootProps {
  text: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  children?: React.ReactNode;
  className?: string;
  menuOpen?: boolean;
}
