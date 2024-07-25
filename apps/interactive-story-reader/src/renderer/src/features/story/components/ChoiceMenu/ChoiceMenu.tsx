import { useState } from 'react';
import { tv } from 'tailwind-variants';

import type { SceneChoice } from '@zougui/interactive-story.story';

import { useWindowEvent } from '@renderer/hooks';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const menu = tv({
  base: '',
  slots: {
    item: 'px-4 py-2 rounded',
  },

  variants: {
    focused: {
      true: {
        item: 'bg-slate-100/20',
      },
    },
  },
});

export const ChoiceMenu = ({ choices, onChoose }: ChoiceMenuProps) => {
  const enrichedChoices = choices.map((choice, index) => {
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

    const choice = enrichedChoices.find((c) => c.letter === event.key.toUpperCase());

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
          const lastIndex = enrichedChoices.length - 1;
          const newIndex = prevFocusedChoiceIndex - 1;
          const newFocusedChoiceIndex = newIndex < 0 ? lastIndex : newIndex;

          return enrichedChoices[newFocusedChoiceIndex];
        });
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedChoice((prevFocusedChoice) => {
          const prevFocusedChoiceIndex = enrichedChoices.findIndex((c) => prevFocusedChoice.id === c.id);
          const lastIndex = enrichedChoices.length - 1;
          const newIndex = prevFocusedChoiceIndex + 1;
          const newFocusedChoiceIndex = newIndex > lastIndex ? 0 : newIndex;

          return enrichedChoices[newFocusedChoiceIndex];
        });
        break;
    }
  });

  return (
    <ul>
      {enrichedChoices.map((choice) => (
        <li
          key={choice.id}
          className={item({ focused: focusedChoice.id === choice.id })}
          onMouseEnter={() => setFocusedChoice(choice)}
          onClick={() => onChoose(choice)}
          data-id="choice"
        >
          {choice.letter}: {choice.text}
        </li>
      ))}
    </ul>
  );
}

export interface ChoiceMenuProps {
  choices: SceneChoice[];
  onChoose: (choice: SceneChoice) => void;
}
