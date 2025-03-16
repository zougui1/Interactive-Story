import { defaultTitle } from '../../constants';
import { getWindowTitle, Router } from '../../utils';
import { electronApi } from '../../../common';

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
