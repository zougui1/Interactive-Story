import { useAppSelector } from '@renderer/store';

import { NoStory } from './NoStory';
import { Story } from './Story';
import { MenuBar } from '../components/MenuBar';

export const StoryMain = () => {
  const story = useAppSelector((state) => state.story.data);

  return (
    <>
      <MenuBar />

      <div className="flex justify-center container mx-auto pt-8">
        {story ? <Story story={story} /> : <NoStory />}
      </div>
    </>
  );
}
