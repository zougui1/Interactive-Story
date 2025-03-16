import { Story } from '@zougui/interactive-story.story';

const { VITE_DEV_STORY_JSON_DATA } = import.meta.env;
const devStoryData = VITE_DEV_STORY_JSON_DATA && JSON.parse(VITE_DEV_STORY_JSON_DATA);
export const story = (devStoryData ?? '___z&w_story_data___') as Story;
