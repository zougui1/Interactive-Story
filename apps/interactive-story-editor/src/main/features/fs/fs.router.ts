import { electronApi } from '@zougui/interactive-story.electron-api';
import { Router } from '@zougui/interactive-story.electron-utils';

import { openFile, saveFile, exportHtml } from './fs.service';
import { getWindowTitle } from '../../utils';

export const router = new Router();

router.on(electronApi.fs.openFile, async ({ browserWindow }) => {
  const result = await openFile();

  if (!result) {
    return;
  }

  browserWindow.setTitle(getWindowTitle(result.story.title));

  return result;
});

router.on(electronApi.fs.save, async ({ request, browserWindow }) => {
  const result = await saveFile(request.body);

  if (result) {
    browserWindow.setTitle(getWindowTitle(request.body.story.title));
  }
});

router.on(electronApi.fs.export.html, async ({ request }) => {
  await exportHtml(request.body);
});
