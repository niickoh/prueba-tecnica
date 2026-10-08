import { Badge } from '../../../../shared/ui/Badge';
import { RESOLUTION_STATUS } from '../../data/labels';
import type { ResolutionStatus } from '../../types';

export function ResolutionStatusBadge({ status }: { status: ResolutionStatus }) {
  return <Badge {...RESOLUTION_STATUS[status]} srPrefix="Estado de resolución" />;
}
