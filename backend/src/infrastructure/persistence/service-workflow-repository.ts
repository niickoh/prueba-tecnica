import type { WorkflowRepository } from '../../application/requests/ports/workflow-repository';
import type { Workflow } from '../../domain/requests/entities/workflow';
import type { OperationsServiceClient } from '../services/operations-service-client';
import { callService } from './service-errors';
import { parseServiceResponse, rawWorkflowSchema } from './service-schemas';

export class ServiceWorkflowRepository implements WorkflowRepository {
  constructor(private readonly service: OperationsServiceClient) {}

  async findById(workflowId: number): Promise<Workflow> {
    const data = await callService(() => this.service.getWorkflow(workflowId), {
      resource: 'Workflow',
      id: workflowId,
    });
    const raw = parseServiceResponse(rawWorkflowSchema, data, 'getWorkflow');
    return { id: raw.workflow_id, status: raw.status };
  }
}
