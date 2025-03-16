import { useSelector } from '@xstate/store/react';

import { Progress } from '~/components/Progress';

import { storySaveStore } from '../storySave';
import { story } from '../story';

export const DesktopStoryStats = () => {
  const stats = useSelector(storySaveStore, state => state.context.stats);

  return (
    <div className="fixed -translate-x-[max(100%_+_1rem)] top-1/2 -translate-y-1/2 w-40 ml-2 flex flex-col gap-4 max-md:hidden">
      {Object.values(stats).filter(stat => !story.stats[stat.id]?.hidden).map(stat => (
        <div key={stat.id} className="flex flex-col gap-2">
          <div className="flex justify-center gap-2" style={{ color: stat.color }}>
            <span>
              {stat.name}
            </span>

            <span>{stat.value}</span>
          </div>

          <Progress
            key={stat.id}
            value={stat.value}
            className="w-36 bg-gray-500"
            color={stat.color}
          />
        </div>
      ))}
    </div>
  );
}
