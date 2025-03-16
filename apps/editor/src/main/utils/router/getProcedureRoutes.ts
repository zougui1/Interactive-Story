import { type ElectronProcedure } from '../../../common';

const isRouteDefinition = (value: ElectronProcedure | RouteDefinition): value is RouteDefinition => {
  return 'fullPath' in value && typeof value.fullPath === 'string';
}

export const getProcedureRoutes = (procedure: ElectronProcedure): Record<string, RouteDefinition> => {
  const routes: Record<string, RouteDefinition> = {};

  const addRoute = (route: RouteDefinition) => {
    if (routes[route.fullPath]) {
      console.warn(`Route "${route.fullPath}" is duplicated`);
      return;
    }

    routes[route.fullPath] = route;
  }

  for (const subProcedueOrRoute of Object.values(procedure)) {
    if (isRouteDefinition(subProcedueOrRoute)) {
      addRoute(subProcedueOrRoute);
      continue;
    }

    const subRoutes = getProcedureRoutes(subProcedueOrRoute);

    for (const subRoute of Object.values(subRoutes)) {
      addRoute(subRoute);
    }
  }

  return routes;
}
