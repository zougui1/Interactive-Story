import { Input } from '@renderer/components/Input';

import { StoryTreeProvider, useStoryTreeContext, type StoryTreeProviderProps } from './context';
import { StoryTreeCurrentScene } from './StoryTreeCurrentScene';
import { StoryTreeSceneChoice } from './StoryTreeSceneChoiceV3';
import { Row } from '../Row';

const StoryTreeRoot = () => {
  const story = useStoryTreeContext();

  return (
    <div className="flex flex-col items-center space-y-24">
      <Row>
        <Input
          label="Title"
          onChange={(event) => story.setTitle(event.currentTarget.value)}
          value={story.title}
          className="w-full"
          autoFocus
        />
      </Row>

      <Row>
        <StoryTreeCurrentScene />
      </Row>

      <Row>
        {story.currentScene.choices
          ?.filter(choiceId => story.choices[choiceId])
          .map((choiceId, index) => (
            <StoryTreeSceneChoice key={choiceId} choice={story.choices[choiceId]} index={index} />
          ))}
      </Row>
    </div>
  );
}

export const StoryTree = (props: StoryTreeProps) => {
  return (
    <StoryTreeProvider {...props}>
      <StoryTreeRoot />
    </StoryTreeProvider>
  );
}

export interface StoryTreeProps extends StoryTreeProviderProps {

}
