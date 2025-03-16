import { Plus } from 'lucide-react';
import { isEqual } from 'radash';
import { useSelector } from '@xstate/store/react';

import { Button } from '@zougui/react.ui';

import { StatFormDialog } from './stat/StatFormDialog';
import { storyStore } from '../story.store';

export const StatLabel = ({ id }: StatLabelProps) => {
  const stat = useSelector(storyStore, state => state.context.data.stats[id]);

  if (!stat) {
    return null;
  }

  return (
    <StatFormDialog defaultStatId={stat.id}>
      <Button variant="ghost" style={{ color: stat.color }}>
        {`${stat.name} (${stat.value})`}
      </Button>
    </StatFormDialog>
  );
}

export interface StatLabelProps {
  id: string;
}

export interface Stat {
  id: string;
  name: string;
  color: string;
}

export const StatsContainer = () => {
  const statIds = useSelector(storyStore, state => Object.keys(state.context.data.stats ?? {}), isEqual);

  return (
    <div className="w-full max-w-full overflow-auto border-b py-2 px-4">
      <div className="inline-flex grid-rows-3 grid-flow-col gap-x-6 gap-y-3 flex-wrap">
        {statIds.map(statId => (
          <StatLabel
            key={statId}
            id={statId}
          />
        ))}

        <StatFormDialog>
          <Button>
            <span>New stat</span>
            <Plus className="h-6 w-6 ml-2" />
          </Button>
        </StatFormDialog>
      </div>
    </div>
  );
}
