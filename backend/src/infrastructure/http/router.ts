import { Router } from 'express';
import { toExpressPath, type ApiRoute } from './route-definition';

export function createRouter(routes: readonly ApiRoute[]): Router {
  const router = Router();

  for (const route of routes) {
    // Express 5 propaga a `errorHandler` los rechazos de handlers async.
    router[route.method](toExpressPath(route.path), async (req, res) => {
      res.json(await route.handle(req));
    });
  }

  return router;
}
