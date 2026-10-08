import type { GetUserRequestDetail } from '../../../application/requests/use-cases/get-user-request-detail';
import type { GetUserRequestFilterOptions } from '../../../application/requests/use-cases/get-user-request-filter-options';
import type { GetUserRequestMetrics } from '../../../application/requests/use-cases/get-user-request-metrics';
import type { ListUserRequests } from '../../../application/requests/use-cases/list-user-requests';
import { defineRoute, type ApiRoute } from '../route-definition';
import { UserIdParamsSchema } from '../schemas/common-schemas';
import {
  ListRequestsQuerySchema,
  PaginatedRequestsSchema,
  RequestDetailParamsSchema,
  RequestDetailSchema,
  RequestFilterOptionsSchema,
  RequestMetricsSchema,
} from '../schemas/request-schemas';

interface RequestRouteDeps {
  listUserRequests: ListUserRequests;
  getUserRequestDetail: GetUserRequestDetail;
  getUserRequestMetrics: GetUserRequestMetrics;
  getUserRequestFilterOptions: GetUserRequestFilterOptions;
}

export function requestRoutes(deps: RequestRouteDeps): ApiRoute[] {
  return [
    defineRoute({
      method: 'get',
      path: '/users/{userId}/requests',
      summary: 'Listado paginado y filtrable de solicitudes',
      description:
        'Los filtros se aplican sobre el conjunto completo antes de paginar. ' +
        'Una página fuera de rango responde 400; un filtro sin resultados responde 200 con `data: []`.',
      tags: ['Requests'],
      errorStatuses: [400, 404, 502],
      params: UserIdParamsSchema,
      query: ListRequestsQuerySchema,
      response: PaginatedRequestsSchema,
      handler: ({ params, query }) =>
        deps.listUserRequests.execute({
          userId: params.userId,
          page: query.page,
          limit: query.limit,
          filters: {
            workflowStatus: query.status,
            priority: query.priority,
            categoryId: query.category,
          },
        }),
    }),
    defineRoute({
      method: 'get',
      path: '/users/{userId}/requests/metrics',
      summary: 'Métricas del dashboard',
      tags: ['Requests'],
      errorStatuses: [400, 404, 502],
      params: UserIdParamsSchema,
      response: RequestMetricsSchema,
      handler: ({ params }) => deps.getUserRequestMetrics.execute(params.userId),
    }),
    defineRoute({
      method: 'get',
      path: '/users/{userId}/requests/filter-options',
      summary: 'Valores disponibles para los filtros del listado',
      tags: ['Requests'],
      errorStatuses: [400, 404, 502],
      params: UserIdParamsSchema,
      response: RequestFilterOptionsSchema,
      handler: ({ params }) => deps.getUserRequestFilterOptions.execute(params.userId),
    }),
    defineRoute({
      method: 'get',
      path: '/users/{userId}/requests/{requestId}',
      summary: 'Detalle de una solicitud (incluye estado de resolución)',
      tags: ['Requests'],
      errorStatuses: [400, 404, 502],
      params: RequestDetailParamsSchema,
      response: RequestDetailSchema,
      handler: ({ params }) => deps.getUserRequestDetail.execute(params.userId, params.requestId),
    }),
  ];
}
