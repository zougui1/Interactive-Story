import { useSelector } from '@xstate/store/react';

import { cn } from '~/utils';

import { SaveMenu } from './SaveMenu';
import { StatsMenu } from './StatsMenu';
import { storySaveStore } from '../storySave';
import { story } from '../story';

export const MobileMenuBar = ({ className }: MobileMenuBarProps) => {
  const hasVisibleStats = useSelector(storySaveStore, state => {
    return Object.values(state.context.stats).some(stat => !story.stats[stat.id]?.hidden);
  });

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
      {hasVisibleStats && (
        <div>
          <StatsMenu />
        </div>
      )}
    </div>
  );
}

export interface MobileMenuBarProps {
  className?: string;
}
