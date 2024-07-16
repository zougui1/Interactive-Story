import {
  StoryTreeProvider,
  useStoryTreeContext,
  type StoryTreeProviderProps,
} from './context';
import { StoryTreeCurrentScene } from './StoryTreeCurrentScene';
import { StoryTreeSceneChoice } from './StoryTreeSceneChoice';
import { Row } from '../Row';

const StoryTreeRoot = () => {
  const story = useStoryTreeContext();

  return (
    <div className="flex flex-col items-center space-y-24">
      <Row>
        <StoryTreeCurrentScene />
      </Row>

      <Row>
        {story.currentScene.choices?.map((choice, index) => (
          <StoryTreeSceneChoice
            key={choice.id}
            choice={choice}
            index={index}
          />
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
