import { useSelector } from '@xstate/store/react';

import { Story } from '@zougui/interactive-story.story';

import { Menu } from '~/components/Menu';
import { Progress } from '~/components/Progress';

import { storySaveStore } from '../storySave';

export const StatsMenu = ({ story }: { story: Story }) => {
  const currentStorySave = useSelector(storySaveStore, state => state.context);

  return (
    <Menu.Root>
      <Menu.Button>Stats</Menu.Button>

      <Menu.Content>
        <Menu.Group>
          {Object.values(currentStorySave.stats).filter(stat => !story.stats[stat.id]?.hidden).map(stat => (
            <Menu.Item
              key={stat.id}
              wrapperClassName="flex items-center"
            >
              <span>
                <div className="flex justify-center gap-2" style={{ color: stat.color }}>
                  <span>
                    {stat.name}
                  </span>

                  <span>{stat.value}</span>
                </div>

                <Progress
                  value={stat.value}
                  className="w-36 bg-gray-500"
                  color={stat.color}
                />
              </span>
            </Menu.Item>
          ))}
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
