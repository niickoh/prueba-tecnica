import type { GetCategory } from '../../../application/requests/use-cases/get-category';
import type { GetResolution } from '../../../application/requests/use-cases/get-resolution';
import type { GetWorkflow } from '../../../application/requests/use-cases/get-workflow';
import { defineRoute, type ApiRoute } from '../route-definition';
import {
  CategoryIdParamsSchema,
  CategorySchema,
  ResolutionIdParamsSchema,
  ResolutionSchema,
  WorkflowIdParamsSchema,
  WorkflowSchema,
} from '../schemas/request-schemas';

interface CatalogRouteDeps {
  getCategory: GetCategory;
  getWorkflow: GetWorkflow;
  getResolution: GetResolution;
}

export function catalogRoutes({
  getCategory,
  getWorkflow,
  getResolution,
}: CatalogRouteDeps): ApiRoute[] {
  return [
    defineRoute({
      method: 'get',
      path: '/categories/{categoryId}',
      summary: 'Categoría por id',
      tags: ['Catalog'],
      errorStatuses: [400, 404, 502],
      params: CategoryIdParamsSchema,
      response: CategorySchema,
      handler: ({ params }) => getCategory.execute(params.categoryId),
    }),
    defineRoute({
      method: 'get',
      path: '/workflows/{workflowId}',
      summary: 'Flujo por id',
      tags: ['Catalog'],
      errorStatuses: [400, 404, 502],
      params: WorkflowIdParamsSchema,
      response: WorkflowSchema,
      handler: ({ params }) => getWorkflow.execute(params.workflowId),
    }),
    defineRoute({
      method: 'get',
      path: '/resolutions/{resolutionId}',
      summary: 'Resolución por id',
      tags: ['Catalog'],
      errorStatuses: [400, 404, 502],
      params: ResolutionIdParamsSchema,
      response: ResolutionSchema,
      handler: ({ params }) => getResolution.execute(params.resolutionId),
    }),
  ];
}
