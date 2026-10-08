import type { OperationalRequest } from './operational-request';
import type { Priority } from './priority';
import type { WorkflowStatus } from './workflow';

export interface RequestFilters {
  workflowStatus?: WorkflowStatus;
  priority?: Priority;
  categoryId?: string;
}

/** Filtros que se evalúan con los datos propios de la solicitud, sin resolver referencias. */
export function matchesOwnFields(request: OperationalRequest, filters: RequestFilters): boolean {
  return (
    (filters.priority === undefined || request.priority === filters.priority) &&
    (filters.categoryId === undefined || request.categoryId === filters.categoryId)
  );
}
