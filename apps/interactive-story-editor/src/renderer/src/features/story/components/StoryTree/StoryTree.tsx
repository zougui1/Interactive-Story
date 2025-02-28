import { isEqual } from 'radash';
import { useSelector } from '@xstate/store/react';

import { StoryTreeProvider, useStoryTreeContext, type StoryTreeProviderProps } from './context';
import { StoryTreeCurrentScene } from './StoryTreeCurrentScene';
import { StoryTreeSceneChoice } from './StoryTreeSceneChoice';
import { Row } from '../Row';
import { storyStore } from '../../story.store';

const StoryTreeRoot = () => {
  const story = useStoryTreeContext();
  const currentChoices = useSelector(storyStore, state => {
    const { data } = state.context;
    const currentScene = data.scenes[story.currentSceneId];

    return currentScene?.choices?.filter(choiceId => data.choices[choiceId]) ?? [];
  }, isEqual);

  return (
    <div className="flex flex-col items-center space-y-16">
      <Row>
        <StoryTreeCurrentScene />
      </Row>

      <Row>
        {currentChoices.map((choiceId, index) => (
          <StoryTreeSceneChoice key={choiceId} choiceId={choiceId} index={index} />
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
