export const WORKFLOW_STATUSES = [
  'in_review',
  'pending_information',
  'approved',
  'rejected',
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export interface Workflow {
  id: number;
  status: WorkflowStatus;
}

const OPEN_WORKFLOW_STATUSES: ReadonlySet<WorkflowStatus> = new Set([
  'in_review',
  'pending_information',
]);

/** Un flujo está abierto mientras no tenga una decisión (aprobado/rechazado). */
export function isWorkflowOpen(status: WorkflowStatus): boolean {
  return OPEN_WORKFLOW_STATUSES.has(status);
}
