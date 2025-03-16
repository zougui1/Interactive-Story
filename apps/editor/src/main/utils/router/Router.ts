import type zod from 'zod';
import type { BrowserWindow } from 'electron';

import { normalizePath } from './utils';

export class Router {
  handlers: Record<string, Handler> = {};

  on<TParams extends zod.ZodType, TResponse extends zod.ZodType>(
    definition: RouteDefinition<TParams, TResponse>,
    handler: (request: HandlerContext<zod.infer<TParams>>) => Promise<zod.infer<TResponse>>,
  ): void {
    this.handlers[normalizePath(definition.fullPath)] = {
      schemas: definition,
      handle: handler,
    };
  }

  use(router: Router): void {
    for (const [path, handler] of Object.entries(router.handlers)) {
      this.on({
        ...handler.schemas,
        fullPath: path,
      }, handler.handle);
    }
  }
}

export interface RouteSchema<TParams extends zod.ZodType, TResponse extends zod.ZodType> {
  params: TParams;
  response: TResponse;
}

export interface Handler<
  TParams extends zod.ZodType = zod.ZodType,
  TResponse extends zod.ZodType = zod.ZodType,
> {
  schemas: RouteSchema<TParams, TResponse>;
  handle: (request: HandlerContext<zod.infer<TParams>>) => Promise<zod.infer<TResponse>>;
}

export interface HandlerContext<T = unknown> {
  request: ElectronRequest<T>;
  sender: { id: number };
  browserWindow: BrowserWindow;
}
