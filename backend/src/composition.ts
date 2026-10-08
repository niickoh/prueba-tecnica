import { RequestComposer } from './application/requests/services/request-composer';
import { GetCategory } from './application/requests/use-cases/get-category';
import { GetResolution } from './application/requests/use-cases/get-resolution';
import { GetUserRequestDetail } from './application/requests/use-cases/get-user-request-detail';
import { GetUserRequestFilterOptions } from './application/requests/use-cases/get-user-request-filter-options';
import { GetUserRequestMetrics } from './application/requests/use-cases/get-user-request-metrics';
import { GetWorkflow } from './application/requests/use-cases/get-workflow';
import { ListUserRequests } from './application/requests/use-cases/list-user-requests';
import { GetCurrentUser } from './application/users/use-cases/get-current-user';
import { GetUserRestrictions } from './application/users/use-cases/get-user-restrictions';
import { ServiceCategoryRepository } from './infrastructure/persistence/service-category-repository';
import { ServiceRequestRepository } from './infrastructure/persistence/service-request-repository';
import { ServiceResolutionRepository } from './infrastructure/persistence/service-resolution-repository';
import { ServiceUserRepository } from './infrastructure/persistence/service-user-repository';
import { ServiceWorkflowRepository } from './infrastructure/persistence/service-workflow-repository';
import type { OperationsServiceClient } from './infrastructure/services/operations-service-client';

export type UseCases = ReturnType<typeof createUseCases>;

/** Cablea repositorios y casos de uso sobre un cliente del `Service` (real o de test). */
export function createUseCases(service: OperationsServiceClient) {
  const users = new ServiceUserRepository(service);
  const requests = new ServiceRequestRepository(service);
  const categories = new ServiceCategoryRepository(service);
  const workflows = new ServiceWorkflowRepository(service);
  const resolutions = new ServiceResolutionRepository(service);
  const composer = new RequestComposer(categories, workflows, resolutions);

  return {
    getCurrentUser: new GetCurrentUser(users),
    getUserRestrictions: new GetUserRestrictions(users),
    listUserRequests: new ListUserRequests(requests, composer),
    getUserRequestDetail: new GetUserRequestDetail(requests, composer),
    getUserRequestMetrics: new GetUserRequestMetrics(requests, composer),
    getUserRequestFilterOptions: new GetUserRequestFilterOptions(requests, categories),
    getCategory: new GetCategory(categories),
    getWorkflow: new GetWorkflow(workflows),
    getResolution: new GetResolution(resolutions),
  };
}
