import type zod from 'zod';

export interface RouteDefinition<
  TParams extends zod.ZodType = zod.ZodType,
  TResponse extends zod.ZodType = zod.ZodType,
> {
  fullPath: string;
  params: TParams;
  response: TResponse;
}
