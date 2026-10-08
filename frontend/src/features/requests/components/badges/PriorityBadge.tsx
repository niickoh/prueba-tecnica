import { Badge } from '../../../../shared/ui/Badge';
import { PRIORITY } from '../../data/labels';
import type { Priority } from '../../types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge {...PRIORITY[priority]} srPrefix="Prioridad" />;
}
