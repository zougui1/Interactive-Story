import { cn } from '~/utils';

import { SaveMenu } from './SaveMenu';

export const DesktopMenuBar = ({ className }: DesktopMenuBarProps) => {
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
    </div>
  );
}

export interface DesktopMenuBarProps {
  className?: string;
}
