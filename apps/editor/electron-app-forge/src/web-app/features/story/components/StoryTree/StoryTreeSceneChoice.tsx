import { useState } from 'react';
import { ChevronDown, ArrowUpToLine } from 'lucide-react';

import { ChoiceType, type SceneChoice } from '@zougui/interactive-story.story';

import { useStoryTreeContext } from './context';
import { StoryTreeSceneChoiceMenu } from './StoryTreeSceneChoiceMenu';
import { Scene } from '../Scene';
import { Tooltip } from '../../../../components/Tooltip';
import { Textarea } from '../../../../components/Textarea';

export const StoryTreeSceneChoice = ({ choice, index }: StoryTreeSceneChoiceProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const story = useStoryTreeContext();

  const targetScene = story.scenes[choice.sceneId];

  return (
    <Scene.Root menuOpen={menuOpen} className="flex flex-col gap-2">
      {choice.type === ChoiceType.Jump && (
        <Scene.Badge position="topLeft">
          <ArrowUpToLine className="w-4" />
        </Scene.Badge>
      )}

      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <Scene.Badge position="topMiddle">
            <span>{index + 1}</span>
          </Scene.Badge>
        </Tooltip.Trigger>

        <Tooltip.Content className="shadow-md shadow-blue-200/20">
          <Textarea
            value={choice.text}
            onChange={e => story.setChoiceText(choice.id, e.currentTarget.value)}
            readOnly={story.readOnly}
            placeholder="Choice text"
          />
        </Tooltip.Content>
      </Tooltip.Root>

      {!story.readOnly && (
        <StoryTreeSceneChoiceMenu
          choice={choice}
          onOpenChange={setMenuOpen}
        />
      )}

      <Scene.Textarea
        value={targetScene?.text || ''}
        onChange={e => story.setSceneText(choice.sceneId, e.currentTarget.value)}
      />

      <Scene.Button
        position="bottomMiddle"
        onClick={() => story.goToChildScene(choice.sceneId)}
      >
        <ChevronDown className="w-6" />
      </Scene.Button>
    </Scene.Root>
  );
}

export interface StoryTreeSceneChoiceProps {
  choice: SceneChoice;
  index: number;
}
