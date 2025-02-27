import React, { useState } from 'react';
import { tv } from 'tailwind-variants';

import type { SceneChoice, Story } from '@zougui/interactive-story.story';

import { useWindowEvent } from '~/hooks';
import { useSelector } from '@xstate/store/react';
import { storySaveStore } from '../../storySave';
import { reorderArray } from '~/utils';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const menu = tv({
  base: '',
  slots: {
    item: 'px-4 py-2 rounded space-x-2 select-none',
  },

  variants: {
    focused: {
      true: {
        item: '',
      },
    },
    disabled: {
      true: {
        item: 'opacity-50',
      },
      false: {
        item: 'cursor-pointer',
      }
    },
  },

  compoundVariants: [
    {
      focused: true,
      disabled: false,
      className: {
        item: 'md:bg-accent md:text-accent-foreground',
      },
    },
  ],
});

export const ChoiceMenu = React.forwardRef<HTMLUListElement, ChoiceMenuProps>(({ choices, onChoose, story }, ref) => {
  const stats = useSelector(storySaveStore, state => state.context.stats);

  const getStatsForCheck = (statCheck: NonNullable<SceneChoice['check']>['stats']) => {
    const statsForCheck = Object.entries(statCheck).filter(([statId]) => !story.stats[statId]?.hidden).map(([statId, value]) => {
      return {
        id: statId,
        name: stats[statId]?.name ?? '',
        color: stats[statId]?.color ?? '',
        value,
      };
    });

    return reorderArray(Object.values(stats), statsForCheck);
  }

  const checkStats = (statCheck: NonNullable<SceneChoice['check']>['stats']): boolean => {
    return Object.entries(statCheck).every(([statId, value]) => {
      return stats[statId] && stats[statId].value >= value;
    });
  }

  const isChoiceHidden = (choice: SceneChoice): boolean => {
    return choice.check?.failEffect === 'hide' && !checkStats(choice.check.stats);
  }

  const isChoiceDisabled = (choice: SceneChoice): boolean => {
    return choice.check?.failEffect === 'disable' && !checkStats(choice.check.stats);
  }

  const enrichedChoices = choices
    .filter(choice => !isChoiceHidden(choice))
    .map((choice, index) => {
      return {
        ...choice,
        letter: alphabet[index],
      };
    });

  const [focusedChoice, setFocusedChoice] = useState(enrichedChoices[0]);

  const { item } = menu();

  useWindowEvent('keydown', (event) => {
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const choice = enrichedChoices
      .filter(c => !isChoiceDisabled(c))
      .find((c) => c.letter === event.key.toUpperCase());

    if (choice) {
      setFocusedChoice(choice);
    }
  });

  useWindowEvent('keyup', (event) => {
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (event.key === 'Enter') {
      onChoose(focusedChoice);
    }
  });

  useWindowEvent('keydown', (event) => {
    // doesn't handle the keydown event on repeat
    // to allow for the native browser scrolling
    if (event.repeat || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedChoice((prevFocusedChoice) => {
          const prevFocusedChoiceIndex = enrichedChoices.findIndex((c) => prevFocusedChoice.id === c.id);

          if (!prevFocusedChoiceIndex) {
            return enrichedChoices.at(-1) ?? prevFocusedChoice;
          }

          // choices above
          const upperChoices = enrichedChoices
            .slice(0, prevFocusedChoiceIndex)
            .toReversed()
            .filter(c => !isChoiceDisabled(c));

          return upperChoices[0] ?? prevFocusedChoice;
        });
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedChoice((prevFocusedChoice) => {
          const prevFocusedChoiceIndex = enrichedChoices.findIndex((c) => prevFocusedChoice.id === c.id);

          if (prevFocusedChoiceIndex === enrichedChoices.length - 1) {
            return enrichedChoices[0] ?? prevFocusedChoice;
          }

          // choices below
          const downChoices = enrichedChoices
            .slice(prevFocusedChoiceIndex + 1)
            .filter(c => !isChoiceDisabled(c));

          return downChoices[0] ?? prevFocusedChoice;
        });
        break;
    }
  });

  return (
    <ul ref={ref}>
      {enrichedChoices.map((choice) => (
        <li
          key={choice.id}
          className={item({
            focused: focusedChoice.id === choice.id,
            disabled: isChoiceDisabled(choice),
          })}
          onMouseEnter={() => setFocusedChoice(choice)}
          onClick={() => onChoose(choice)}
          data-id="choice"
        >
          <span>{choice.letter}:</span>

          {choice.check && (
            <span className="space-x-2">
              {getStatsForCheck(choice.check.stats).map(stat => (
                <span key={stat.id}>
                  <span>(</span>

                  <span style={{ color: stat.color }}>
                    {stat.name}
                  </span>

                  <span>{' Check'})</span>
                </span>
              ))}
            </span>
          )}

          <span>{choice.text}</span>
        </li>
      ))}
    </ul>
  );
});

ChoiceMenu.displayName = 'ChoiceMenu';

export interface ChoiceMenuProps {
  story: Story;
  choices: SceneChoice[];
  onChoose: (choice: SceneChoice) => void;
}
