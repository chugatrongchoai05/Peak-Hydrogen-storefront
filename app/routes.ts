import { flatRoutes } from '@react-router/fs-routes';
import { prefix, type RouteConfig } from '@react-router/dev/routes';
import { hydrogenRoutes } from '@shopify/hydrogen';

export default hydrogenRoutes([
  ...prefix(':locale?', await flatRoutes()),
]) satisfies RouteConfig;