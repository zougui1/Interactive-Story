import { electronApi } from '@zougui/interactive-story.electron-api';
import { Router } from '@zougui/interactive-story.electron-utils';

import { title } from '../../constants';

export const router = new Router();

router.on(electronApi.window.titleReset, async ({ browserWindow }) => {
  browserWindow.setTitle(title);
});