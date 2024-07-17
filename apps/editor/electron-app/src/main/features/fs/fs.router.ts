import { electronApi } from '@zougui/interactive-story.electron-api';
import { Router } from '@zougui/interactive-story.electron-utils';

import { openFile, saveFile } from './fs.service';
import { getFileAsTitle } from './utils';

export const router = new Router();

router.on(electronApi.fs.openFile, async ({ browserWindow }) => {
  const result = await openFile();

  if (!result) {
    return;
  }

  browserWindow.setTitle(getFileAsTitle(result.filePath));

  return result;
});



router.on(electronApi.fs.save, async ({ request, browserWindow }) => {
  const result = await saveFile(request.body);

  if (result) {
    browserWindow.setTitle(getFileAsTitle(result.filePath));
  }
});
