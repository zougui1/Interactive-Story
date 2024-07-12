import { useState } from 'react';
import { Plus, ChevronUp, ChevronDown, Trash2, ArrowUpLeft, EllipsisVertical } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Row } from './features/story-creation/components/Row';
import { Scene } from './features/story-creation/components/Scene';

import { defaultStory } from './mock';
import type { Scene as SceneData, SceneChoice } from './types';
import { isNumber } from 'radash';
import { Tooltip } from './components/Tooltip';
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';
import { Dropdown } from './components/Dropdown';

const Menu = () => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Scene.Button position="topRight">
          <EllipsisVertical className="w-4" />
        </Scene.Button>
      </Dropdown.Trigger>
    </Dropdown.Root>
  );
}


const StoryChoice = ({ story, onChange }: StoryChoiceProps) => {
  return (
    <Row>
      {story.choices?.map((choice, index) => (
        <Scene.Root
          key={`${index}`}
          text={choice.scene.text}
          choice={choice.text}
          onChange={e => onChange?.({ ...story, choices: story.choices?.map((c, i) => index === i ? { ...c, scene: { ...c.scene, text: e.currentTarget.value } } : c) })}
        >
          <Scene.Button
            position="topLeft"
            onClick={() => onChange?.({ ...story, choices: story.choices?.filter((c, i) => index !== i) })}
            showOnHoverOnly
          >
            <ArrowUpLeft className="w-4" />
          </Scene.Button>

          {isNumber(index) && (
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <Scene.Button position="topMiddle" className="cursor-default">
                  <span>{index + 1}</span>
                </Scene.Button>
              </Tooltip.Trigger>

              <Tooltip.Content className="shadow-md shadow-blue-200/20">
                <Textarea
                  value={choice.text}
                  onChange={e => onChange?.({ ...story, choices: story.choices?.map((c, i) => index === i ? { ...c, text: e.currentTarget.value } : c) })}
                />
              </Tooltip.Content>
            </Tooltip.Root>
          )}

          <Scene.Button
            position="topRight"
            onClick={() => onChange?.({ ...story, choices: story.choices?.filter((c, i) => index !== i) })}
            showOnHoverOnly
          >
            <Trash2 className="w-4 text-red-500" />
          </Scene.Button>

          <Scene.Button
            position="bottomMiddle"
            onClick={() => onChange?.({ ...choice.scene, parent: story })}
          >
            <ChevronDown className="w-6" />
          </Scene.Button>
        </Scene.Root>
      ))}
    </Row>
  );
}

export interface StoryChoiceProps {
  story: SceneData;
  onChange?: (story: SceneData) => void;
}

export const App = () => {
  const [story, setStory] = useState<SceneData>(defaultStory);

  const handleAddChoice = () => {
    setStory(prevStory => {
      return {
        ...prevStory,
        choices: [
          ...(prevStory.choices || []),
          {
            text: '',
            scene: {
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
          <Scene.Root text={story.text} onChange={e => setStory({ ...story, text: e.currentTarget.value })}>
            {story.parent && (
              <Scene.Button position="topMiddle" onClick={handleUp}>
                <ChevronUp className="w-6" />
              </Scene.Button>
            )}

            <Scene.Button position="bottomMiddle" onClick={handleAddChoice}>
              <Plus className="w-4" />
            </Scene.Button>
          </Scene.Root>
        </Row>

        <StoryChoice story={story} onChange={setStory} />
      </div>
    </div>
  );
}
