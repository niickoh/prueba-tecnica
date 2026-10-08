import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import type { UseCases } from './composition';
import {
  errorHandler,
  notFoundHandler,
  type Logger,
} from './infrastructure/http/middlewares/error-handler';
import { buildOpenApiDocument } from './infrastructure/http/openapi';
import { createRouter } from './infrastructure/http/router';
import { catalogRoutes } from './infrastructure/http/routes/catalog-routes';
import { requestRoutes } from './infrastructure/http/routes/request-routes';
import { userRoutes } from './infrastructure/http/routes/user-routes';

export interface AppOptions {
  useCases: UseCases;
  corsOrigins: string[];
  logger?: Logger;
}

/** Crea la app HTTP sin escuchar ningún puerto (la usan `main` y los tests). */
export function createApp({ useCases, corsOrigins, logger = console }: AppOptions): Express {
  const routes = [...userRoutes(useCases), ...requestRoutes(useCases), ...catalogRoutes(useCases)];
  const openApiDocument = buildOpenApiDocument(routes);

  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/api', createRouter(routes));
  app.get('/docs/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(notFoundHandler);
  app.use(errorHandler(logger));
  return app;
}
