import { openFile, saveFile, exportHtml } from './fs.service';
import { getWindowTitle, Router } from '../../utils';
import { electronApi } from '../../../common';

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
