import { useState } from 'react';
import { nanoid } from 'nanoid';

import { Input } from '@renderer/components/Input';
import { Button } from '@zougui/react.ui';
import { Plus } from 'lucide-react';
import { StatFormDialog } from './stat/StatFormDialog';
import { isEqual } from 'radash';
import { useSelector } from '@xstate/store/react';
import { storyStore } from '../story.store';

const StatInput = ({ stat, onChange }: StatInputProps) => {
  const handleChange = (field: keyof Stat) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...stat,
      [field]: event.currentTarget.value,
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={stat.name}
        onChange={handleChange('name')}
        className="w-[20ch]"
        style={{ color: stat.color }}
        autoFocus={false}
      />
      <Input
        type="color"
        value={stat.color}
        onChange={handleChange('color')}
        className="w-20"
        autoFocus={false}
      />
    </div>
  );
}

export interface StatInputProps {
  stat: Stat;
  onChange: (value: Stat) => void;
}

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

const createNewStat = (): Stat => {
  return {
    id: nanoid(),
    name: '',
    color: '#ffffff',
  };
}

const getDefaultStats = (): Record<string, Stat> => {
  const defaultStat = createNewStat();

  return {
    [defaultStat.id]: defaultStat,
  };
}

export const StatsContainer = () => {
  const statIds = useSelector(storyStore, state => Object.keys(state.context.data.stats ?? {}), isEqual);
  console.log('statIds:', statIds)

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

export const StatsContainer_legacy = () => {
  const [stats, setStats] = useState<Record<string, Stat>>(getDefaultStats);

  const handleChange = (stat: Stat) => {
    setStats(prevStats => {
      if (!prevStats[stat.id]) {
        return prevStats;
      }

      const updatedStats = {
        ...prevStats,
        [stat.id]: stat,
      };

      const statIds = Object.keys(prevStats);

      if (stat.id === statIds.at(-1)) {
        const newStat = createNewStat();
        updatedStats[newStat.id] = newStat;
      }



      return updatedStats;
    });
  }

  return (
    <div className="w-full max-w-full overflow-auto border-b py-2 px-4">
      <div className="inline-flex grid-rows-3 grid-flow-col gap-x-6 gap-y-3 flex-wrap">
        {Object.values(stats).map(stat => (
          <StatInput
            key={stat.id}
            stat={stat}
            onChange={handleChange}
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
