import type zod from 'zod';

declare global {
  export interface Window {
    electron?: IContextBridge | undefined;
  }

  export interface ElectronRequest<T = unknown> {
    headers: { id: string };
    body: T;
  }

  export interface IContextBridge {
    send(channel: string, data?: unknown): void;
    on(channel: string, listener: (event: unknown, data: ElectronRequest) => void): (() => void);
    once(channel: string, listener: (event: unknown, data: ElectronRequest) => void): (() => void);
  }

  export interface RouteDefinition<
    TParams extends zod.ZodType = zod.ZodType,
    TResponse extends zod.ZodType = zod.ZodType,
  > {
    fullPath: string;
    params: TParams;
    response: TResponse;
  }
}
