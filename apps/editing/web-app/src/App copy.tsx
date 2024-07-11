import { isNumber } from 'radash';
import { useState } from 'react';

import { defaultStory } from './mock';
import type { Story, StoryChoice } from './types';

const Rect = ({ text, index, choice, onAdd }: RectProps) => {
  return (
    <div className="flex-none relative size-56 border border-slate-300 rounded py-6 px-4 bg-slate-900">
      {isNumber(index) && (
        <div title={choice} className="absolute size-9 top-0 left-1/2 rounded-full border border-slate-300 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-slate-900">
          <span>{index}</span>
        </div>
      )}

      <div className="h-full pr-2 overflow-auto">
        <p>{text}</p>
      </div>

      <div onClick={onAdd} className="cursor-pointer text-2xl absolute size-9 bottom-0 left-1/2 rounded-full border border-slate-300 -translate-x-1/2 translate-y-1/2 flex items-center justify-center bg-slate-900">
        +
      </div>
    </div>
  );
}

export interface RectProps {
  text: string;
  index?: number;
  choice?: string;
  onAdd?: React.MouseEventHandler;
  className?: string;
}

const Row = ({ children }: RowProps) => {
  return (
    <div className="flex w-full gap-4 overflow-x-auto py-6">
      {children}
    </div>
  );
}

export interface RowProps {
  children: React.ReactNode;
  className?: string;
}

const StoryPart = ({ story, onAdd }: StoryPartProps) => {
  const handleAdd = (choice: StoryChoice, index: number, subStory?: Story) => {
    if (subStory) {
      onAdd?.({
        ...story,
        choices: story.choices?.map((c, i) => {
          if (index !== i) {
            return c;
          }

          return {
            ...choice,
            story: subStory,
          };
        }),
      });
      return;
    }

    onAdd?.({
      ...story,
      choices: story.choices?.map((c, i) => {
        if (index !== i) {
          return c;
        }

        return {
          ...choice,
          story: {
            ...choice.story,
            choices: [
              ...(choice.story.choices || []),
              { text: '', story: { text: '' } },
            ],
          },
        };
      }),
    });
  }

  return (
    <>
      <Row>
        {story.choices?.map((choice, index) => (
          <Rect
            key={`${index}-${choice.text}`}
            text={choice.story.text}
            index={index + 1}
            choice={choice.text}
            onAdd={() => handleAdd(choice, index)}
          />
        ))}
      </Row>

      {story.choices?.filter(c => c.story.choices?.length).map((choice, index) => (
        <StoryPart
          key={`${index}-${choice.text}`}
          story={choice.story}
          //onAdd={subStory => onAdd?.({ ...story, choices: story.choices?.map((c, i) => i === index ? { ...choice, story: subStory } : choice) })}
          onAdd={subStory => handleAdd(choice, index, subStory)}
        />
      ))}
    </>
  );
}

export interface StoryPartProps {
  story: Story;
  onAdd?: (story: Story) => void;
}

export const App = () => {
  const [story, setStory] = useState<Story>(defaultStory);

  const handleAddChoice = () => {
    setStory(prevStory => {
      return {
        ...prevStory,
        choices: [
          ...(prevStory.choices || []),
          {
            text: '',
            story: {
              text: '',
            },
          },
        ],
      };
    });
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col items-center gap-16">
        <Row>
          <Rect text={story.text} onAdd={handleAddChoice} />
        </Row>

        <StoryPart story={story} onAdd={setStory} />
      </div>
    </div>
  );
}
