import { useSelector } from '@xstate/store/react';

import { StoryTree } from '../components/StoryTree';
import { MenuBar } from '../components/MenuBar';
import { StatsContainer } from '../components/StatsContainer';
import { storyStore } from '../story.store';

export const Story = () => {
  const syntheticKey = useSelector(storyStore, state => state.context.syntheticKey);
  const story = useSelector(storyStore, state => state.context.data);

  return (
    <>
      <MenuBar />

      <StatsContainer />

      <div className="flex justify-center container mx-auto pt-8">
        <StoryTree
          key={syntheticKey}
          onChange={story => storyStore.trigger.updateStory({ story })}
          defaultStory={story}
        />
      </div>
    </>
  );
}
