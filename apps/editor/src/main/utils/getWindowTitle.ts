import { defaultTitle } from '../constants';

const maxStoryTitleLength = 50;

export const getWindowTitle = (storyTitle: string): string => {
  const trimmedTitle = storyTitle.length > maxStoryTitleLength
    ? `${storyTitle.slice(0, maxStoryTitleLength).trim()}...`
    : storyTitle;

  return `${trimmedTitle} - ${defaultTitle}`;
}
