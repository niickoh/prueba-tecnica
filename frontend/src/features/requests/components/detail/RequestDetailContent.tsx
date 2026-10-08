import { formatDateTime } from '../../../../lib/format';
import { Card } from '../../../../shared/ui/Card';
import type { RequestDetail } from '../../types';
import { PriorityBadge } from '../badges/PriorityBadge';
import { ResolutionStatusBadge } from '../badges/ResolutionStatusBadge';
import { WorkflowStatusBadge } from '../badges/WorkflowStatusBadge';
import { DetailField } from './DetailField';

export function RequestDetailContent({ request }: { request: RequestDetail }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card aria-labelledby="status-heading">
        <h2 id="status-heading" className="mb-4 text-base font-semibold text-ink">
          Estado
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Estado del flujo">
            <WorkflowStatusBadge status={request.workflow.status} />
          </DetailField>
          <DetailField label="Estado de resolución">
            <ResolutionStatusBadge status={request.resolution.status} />
          </DetailField>
          <DetailField label="Prioridad">
            <PriorityBadge priority={request.priority} />
          </DetailField>
          <DetailField label="Categoría">{request.category.description}</DetailField>
        </dl>
      </Card>
      <Card aria-labelledby="info-heading">
        <h2 id="info-heading" className="mb-4 text-base font-semibold text-ink">
          Información
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Identificador">#{request.id}</DetailField>
          <DetailField label="Fecha de creación">
            <time dateTime={request.createdAt}>{formatDateTime(request.createdAt)}</time>
          </DetailField>
          <DetailField label="Solicitante">
            {request.requester.name}
            <span className="block text-ink-secondary">{request.requester.area}</span>
          </DetailField>
        </dl>
      </Card>
    </div>
  );
}
