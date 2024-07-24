import { useState } from 'react';
import { ChevronDown, ArrowUpToLine, ArrowDown } from 'lucide-react';

import { ChoiceType, type SceneChoice } from '@zougui/interactive-story.story';

import { Tooltip } from '@renderer/components/Tooltip';
import { Textarea } from '@renderer/components/Textarea';

import { useStoryTreeContext } from './context';
import { StoryTreeSceneChoiceMenu } from './StoryTreeSceneChoiceMenu';
import { Scene } from '../Scene';

export const StoryTreeSceneChoice = ({ choice, index }: StoryTreeSceneChoiceProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const story = useStoryTreeContext();

  const targetScene = story.scenes[choice.sceneId];

  return (
    <div className="flex flex-col items-center space-y-4">
      <Textarea
        value={choice.text}
        onChange={e => story.setChoiceText(choice.id, e.currentTarget.value)}
        readOnly={story.readOnly}
        placeholder="Choice text"
        className="h-44 resize-none"
      />

      <ArrowDown className="w-6" />

      <Scene.Root menuOpen={menuOpen} className="flex flex-col gap-2">
        {choice.type === ChoiceType.Jump && (
          <Scene.Badge position="topLeft">
            <ArrowUpToLine className="w-4" />
          </Scene.Badge>
        )}

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
    </div>
  );
}

export interface StoryTreeSceneChoiceProps {
  choice: SceneChoice;
  index: number;
}
