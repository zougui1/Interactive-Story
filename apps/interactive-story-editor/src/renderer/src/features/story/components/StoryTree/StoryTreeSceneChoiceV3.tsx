import { useState } from 'react';
import { ChevronDown, ArrowUpToLine, ArrowDown } from 'lucide-react';

import { ChoiceType, type SceneChoice } from '@zougui/interactive-story.story';

import { Textarea } from '@renderer/components/Textarea';

import { useStoryTreeContext } from './context';
import { StoryTreeSceneChoiceMenu } from './StoryTreeSceneChoiceMenu';
import { Scene } from '../Scene';

export const StoryTreeSceneChoice = ({ choice }: StoryTreeSceneChoiceProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const story = useStoryTreeContext();

  const targetScene = story.scenes[choice.sceneId];

  return (
    <Scene.Root menuOpen={menuOpen} className="flex flex-col items-center gap-2 h-[30rem]">
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
        value={choice.text}
        onChange={e => story.setChoiceText(choice.id, e.currentTarget.value)}
        readOnly={story.readOnly}
        placeholder="Choice text"
        className="h-2/5"
        autoFocus
      />

      <ArrowDown className="w-6 h-6 mb-4" />

      <Scene.Textarea
        value={targetScene?.text || ''}
        onChange={e => story.setSceneText(choice.sceneId, e.currentTarget.value)}
        className="h-3/5"
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
