export interface ElectronProcedure {
  [key: string]: RouteDefinition | ElectronProcedure;
}
