import { useSelector } from '@xstate/store/react';

import { StoryTree } from '../components/StoryTree';
import { MenuBar } from '../components/MenuBar';
import { StatsContainer } from '../components/StatsContainer';
import { storyStore } from '../story.store';
import { TitleInput } from '../components/TitleInput';

export const Story = () => {
  const syntheticKey = useSelector(storyStore, state => state.context.syntheticKey);
  const story = useSelector(storyStore, state => state.context.data);

  return (
    <>
      <MenuBar />

      <StatsContainer />

      <div className="flex flex-col items-center space-y-16 pt-6">
        <div>
          <TitleInput />
        </div>

        <div className="flex justify-center container mx-auto">
          <StoryTree
            key={syntheticKey}
            defaultStory={story}
          />
        </div>
      </div>
    </>
  );
}
