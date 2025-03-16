import { ipcMain, type BrowserWindow } from 'electron';

import { getProcedureRoutes } from './getProcedureRoutes';
import type { Handler, Router } from './Router';
import { type ElectronProcedure } from '../../../common';

export const handleProcedure = ({ procedure, router, getWindow }: HandleProcedureOptions): void => {
  const routes = getProcedureRoutes(procedure);

  for (const route of Object.values(routes)) {
    const handler = router.handlers[route.fullPath];

    if (!handler) {
      console.warn(`No handler for route "${route.fullPath}"`);
      continue;
    }

    handleRoute(route.fullPath, handler, getWindow);
  }
}

const handleRoute = (path: string, handler: Handler, getWindow: () => BrowserWindow): void => {
  ipcMain.on(path, async (event, req: ElectronRequest) => {
    try {
      console.log(path);
      const body = await handler.schemas.params.parseAsync(req.body);
      const result = await handler.handle({
        request: {
          ...req,
          body,
        },
        get browserWindow() {
          return getWindow();
        },
        sender: { id: event.sender.id },
      });
      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: result,
      };

      event.reply(`${path}.success`, response);
    } catch (error) {
      console.log('communication error:', error);

      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: error,
      };
      event.reply(`${path}.error`, response);
    }
  });
}

export interface HandleProcedureOptions {
  procedure: ElectronProcedure;
  router: Router;
  getWindow: () => BrowserWindow;
}
