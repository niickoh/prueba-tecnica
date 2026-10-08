import { Link } from 'react-router';
import { formatDate } from '../../../../lib/format';
import type { RequestSummary } from '../../types';
import { PriorityBadge } from '../badges/PriorityBadge';
import { WorkflowStatusBadge } from '../badges/WorkflowStatusBadge';

interface RequestListItemProps {
  request: RequestSummary;
  /** Query string del listado, para volver con los mismos filtros. */
  listSearch: string;
}

export function RequestListItem({ request, listSearch }: RequestListItemProps) {
  return (
    <article className="relative flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors focus-within:border-accent hover:border-accent sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-6">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-xs font-medium text-ink-secondary">
          <span className="sr-only">Identificador: </span>#{request.id}
        </p>
        <h3 className="text-base font-semibold text-ink">
          <Link
            to={`/requests/${request.id}`}
            state={{ listSearch }}
            className="after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:outline-none"
          >
            {request.subject}
          </Link>
        </h3>
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-secondary">
          <div className="flex gap-1">
            <dt className="sr-only sm:not-sr-only">Solicitante:</dt>
            <dd className="text-ink">{request.requester.name}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only sm:not-sr-only">Categoría:</dt>
            <dd>{request.category.description}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only sm:not-sr-only">Creada:</dt>
            <dd>
              <time dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
        <WorkflowStatusBadge status={request.workflow.status} />
        <PriorityBadge priority={request.priority} />
      </div>
    </article>
  );
}
