import { electronApi } from '@zougui/interactive-story.electron-api';
import { Router } from '@zougui/interactive-story.electron-utils';

import { defaultTitle } from '../../constants';
import { getWindowTitle } from '../../utils';

export const router = new Router();

router.on(electronApi.window.title.reset, async ({ browserWindow }) => {
  browserWindow.setTitle(defaultTitle);
});

router.on(electronApi.window.title.set, async ({ browserWindow, request }) => {
  const newTitle = request.body.title.trim()
    ? getWindowTitle(request.body.title)
    : defaultTitle;

  browserWindow.setTitle(newTitle);
});
