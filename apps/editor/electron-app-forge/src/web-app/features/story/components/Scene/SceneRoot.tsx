import { useState } from 'react';

import { SceneProvider } from './context';
import { cn } from '../../../../utils';

export const SceneRoot = ({ children, className, menuOpen }: SceneRootProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <SceneProvider hovered={hovered || Boolean(menuOpen)}>
      <div
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn('relative size-64 border border-slate-300 rounded py-7 px-4 bg-slate-900', className)}
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
