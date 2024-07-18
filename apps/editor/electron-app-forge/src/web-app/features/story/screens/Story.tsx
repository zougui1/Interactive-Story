import { StoryTree } from '../components/StoryTree';
import { MenuBar } from '../components/MenuBar';
import { updateStory } from '../storySlice';
import { useAppDispatch, useAppSelector } from '../../../store';

export const Story = () => {
  const dispatch = useAppDispatch();
  const syntheticKey = useAppSelector(state => state.story.syntheticKey);
  const story = useAppSelector(state => state.story.data);

  return (
    <>
      <MenuBar />

      <div className="flex justify-center container mx-auto pt-8">
        <StoryTree
          key={syntheticKey}
          onChange={story => dispatch(updateStory(story))}
          defaultStory={story}
        />
      </div>
    </>
  );
}