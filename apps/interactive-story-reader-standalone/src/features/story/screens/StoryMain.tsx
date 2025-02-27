import { NoStory } from './NoStory';
import { Story } from './Story';
import { DesktopMenuBar } from '../components/DesktopMenuBar';
import { MobileMenuBar } from '../components/MobileMenuBar';

const { VITE_DEV_STORY_JSON_DATA } = import.meta.env;
const devStoryData = VITE_DEV_STORY_JSON_DATA && JSON.parse(VITE_DEV_STORY_JSON_DATA);
const story = devStoryData ?? '___z&w_story_data___';

export const StoryMain = () => {
  return (
    <div className="[--header-height:40px]">
      <DesktopMenuBar className="max-md:hidden" />
      {story && <MobileMenuBar story={story} className="md:hidden" />}

      <div className="pt-8 min-h-[calc(100vh-var(--header-height))]">
        {story ? <Story story={story} /> : <NoStory />}
      </div>
    </div>
  );
}
