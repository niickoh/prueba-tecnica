import type { Workflow } from '../../../domain/requests/entities/workflow';

export interface WorkflowRepository {
  /** Lanza `NotFoundError` si el flujo no existe. */
  findById(workflowId: number): Promise<Workflow>;
}
