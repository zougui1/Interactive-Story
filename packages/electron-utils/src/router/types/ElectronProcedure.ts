import type { RouteDefinition } from './RouteDefinition';

export interface ElectronProcedure {
  [key: string]: RouteDefinition | ElectronProcedure;
}
