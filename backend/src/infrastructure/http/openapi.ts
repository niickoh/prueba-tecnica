import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import type { ApiRoute } from './route-definition';
import { ErrorResponseSchema } from './schemas/common-schemas';

const ERROR_DESCRIPTIONS: Record<ApiRoute['errorStatuses'][number], string> = {
  400: 'Parámetros inválidos o página fuera de rango',
  404: 'Recurso inexistente',
  502: 'La fuente de datos falló o respondió con un formato inesperado',
};

/** Documento OpenAPI generado a partir de las mismas definiciones que usa el router. */
export function buildOpenApiDocument(routes: readonly ApiRoute[]) {
  const registry = new OpenAPIRegistry();

  for (const route of routes) {
    const errorResponses = Object.fromEntries(
      route.errorStatuses.map((status) => [
        status,
        {
          description: ERROR_DESCRIPTIONS[status],
          content: { 'application/json': { schema: ErrorResponseSchema } },
        },
      ]),
    );

    registry.registerPath({
      method: route.method,
      path: route.path,
      summary: route.summary,
      description: route.description,
      tags: route.tags,
      request: { params: route.params, query: route.query },
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: route.response } },
        },
        ...errorResponses,
      },
    });
  }

  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Centro de Solicitudes Operativas API',
      version: '1.0.0',
      description: 'API de lectura construida sobre el `Service` provisto.',
    },
    servers: [{ url: '/api' }],
  });
}
