import { toWorkflowDto, type WorkflowDto } from '../dtos/request-dtos';
import type { WorkflowRepository } from '../ports/workflow-repository';

export class GetWorkflow {
  constructor(private readonly workflows: WorkflowRepository) {}

  async execute(workflowId: number): Promise<WorkflowDto> {
    return toWorkflowDto(await this.workflows.findById(workflowId));
  }
}
