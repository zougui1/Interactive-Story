import zod from 'zod';

export interface RouteDefinition<TParams extends zod.ZodType, TResponse extends zod.ZodType> {
  fullPath: string;
  params: TParams;
  response: TResponse;
}
