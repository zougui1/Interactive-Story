import { useState } from 'react';
import { Plus, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Row } from './features/story-creation/components/Row';
import { StoryPart } from './features/story-creation/components/StoryPart';

import { defaultStory } from './mock';
import type { Story, StoryChoice } from './types';
import { isNumber } from 'radash';
import { Tooltip } from './components/Tooltip';
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';


const StoryChoice = ({ story, onChange }: StoryChoiceProps) => {
  return (
    <Row>
      {story.choices?.map((choice, index) => (
        <StoryPart.Root
          key={`${index}`}
          text={choice.story.text}
          choice={choice.text}
          onChange={e => onChange?.({ ...story, choices: story.choices?.map((c, i) => index === i ? { ...c, story: { ...c.story, text: e.currentTarget.value } } : c) })}
        >
          {isNumber(index) && (
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <StoryPart.Button position="topMiddle" className="cursor-default">
                  <span>{index + 1}</span>
                </StoryPart.Button>
              </Tooltip.Trigger>

              <Tooltip.Content className="shadow-md shadow-blue-200/20">
                <Textarea
                  value={choice.text}
                  onChange={e => onChange?.({ ...story, choices: story.choices?.map((c, i) => index === i ? { ...c, text: e.currentTarget.value } : c) })}
                />
              </Tooltip.Content>
            </Tooltip.Root>
          )}

          <StoryPart.Button
            position="topRight"
            onClick={() => onChange?.({ ...story, choices: story.choices?.filter((c, i) => index !== i) })}
            showOnHoverOnly
          >
            <Trash2 className="w-4 text-red-500" />
          </StoryPart.Button>

          <StoryPart.Button
            position="bottomMiddle"
            onClick={() => onChange?.({ ...choice.story, parent: story })}
          >
            <ChevronDown className="w-6" />
          </StoryPart.Button>
        </StoryPart.Root>
      ))}
    </Row>
  );
}

export interface StoryChoiceProps {
  story: Story;
  onChange?: (story: Story) => void;
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
              id: nanoid(),
              text: '',
            },
          },
        ],
      };
    });
  }

  const handleUp = () => {
    setStory(prevStory => {
      return {
        ...prevStory.parent,
        choices: prevStory.parent.choices?.map((choice, i) => choice.story.id === prevStory.id ? { ...choice, story: prevStory } : choice)
      };
    });
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col items-center gap-16">
        <Row>
          <StoryPart.Root text={story.text} onChange={e => setStory({ ...story, text: e.currentTarget.value })}>
            {story.parent && (
              <StoryPart.Button position="topMiddle" onClick={handleUp}>
                <ChevronUp className="w-6" />
              </StoryPart.Button>
            )}

            <StoryPart.Button position="bottomMiddle" onClick={handleAddChoice}>
              <Plus className="w-4" />
            </StoryPart.Button>
          </StoryPart.Root>
        </Row>

        <StoryChoice story={story} onChange={setStory} />
      </div>
    </div>
  );
}
