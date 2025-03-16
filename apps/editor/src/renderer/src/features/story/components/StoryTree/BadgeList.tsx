import { Tooltip } from '@renderer/components/Tooltip';
import { cn } from '@renderer/utils';

import { Badge } from './Badge';

export const BadgeList = ({ items, renderValue, className }: BadgeListProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={cn(
            'absolute bottom-0 translate-y-1/2 flex gap-2 overflow-hidden',
            className,
          )}
        >
          {items.map(item => (
            <span key={item.name}>
              <Badge color={item.color}>
                {renderValue?.(item.value) ?? item.value}
              </Badge>
            </span>
          ))}
        </div>
      </Tooltip.Trigger>

      <Tooltip.Content className="flex gap-3 w-auto max-w-none">
        {items.map(item => (
          <span
            key={item.name}
            className="flex justify-center items-center gap-2 rounded-full font-bold"
          >
            <span style={{ color: item.color }}>
              {item.name}
            </span>

            <span>
              {renderValue?.(item.value) ?? item.value}
            </span>
          </span>
        ))}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export interface BadgeListProps {
  items: { value: number; name: string; color: string; }[];
  renderValue?: (value: number) => string | number;
  className?: string;
}
