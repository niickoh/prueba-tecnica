import { Badge } from '../../../../shared/ui/Badge';
import { WORKFLOW_STATUS } from '../../data/labels';
import type { WorkflowStatus } from '../../types';

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  return <Badge {...WORKFLOW_STATUS[status]} srPrefix="Estado del flujo" />;
}
