import { cn } from '~/utils';

import { SaveMenu } from './SaveMenu';
import { StatsMenu } from './StatsMenu';

export const MobileMenuBar = ({ className }: MobileMenuBarProps) => {
  return (
    <div
      className={cn(
        'sticky z-50 w-full top-0 region-drag select-none bg-black flex justify-between h-[var(--header-height)]',
        className,
      )}
    >
      <div>
        <SaveMenu />
      </div>
      <div>
        <StatsMenu />
      </div>
    </div>
  );
}

export interface MobileMenuBarProps {
  className?: string;
}
