import { useState } from 'react';

import { cn } from '@renderer/utils';

import { SceneProvider } from './context';

export const SceneRoot = ({ children, className, menuOpen }: SceneRootProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <SceneProvider hovered={hovered || Boolean(menuOpen)}>
      <div
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn('group relative size-64 border border-slate-300 rounded py-7 px-4 bg-slate-900', className)}
      >
        {children}
      </div>
    </SceneProvider>
  );
}

export interface SceneRootProps {
  children?: React.ReactNode;
  className?: string;
  menuOpen?: boolean;
}
