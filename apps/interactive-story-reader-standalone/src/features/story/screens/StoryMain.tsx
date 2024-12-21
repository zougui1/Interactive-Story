import { NoStory } from './NoStory';
import { Story } from './Story';
import { MenuBar } from '../components/MenuBar';

const { VITE_DEV_STORY_JSON_DATA } = import.meta.env;
const devStoryData = VITE_DEV_STORY_JSON_DATA && JSON.parse(VITE_DEV_STORY_JSON_DATA);
const story = devStoryData ?? '___z&w_story_data___';

export const StoryMain = () => {
  return (
    <>
      <MenuBar />

      <div className="flex justify-center container mx-auto pt-8 min-h-screen">
        {story ? <Story story={story} /> : <NoStory />}
      </div>
    </>
  );
}
