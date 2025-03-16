import path from 'node:path';

import { app } from 'electron';

export const defaultTitle = 'Interactive Story Editor';
export const appPath = app.getAppPath().replace('app.asar', '');
export const extraResourcesPath = path.join(appPath, 'extraResources');
