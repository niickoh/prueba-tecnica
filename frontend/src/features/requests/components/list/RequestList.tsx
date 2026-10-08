import type { RequestSummary } from '../../types';
import { RequestListItem } from './RequestListItem';

interface RequestListProps {
  requests: RequestSummary[];
  listSearch: string;
}

export function RequestList({ requests, listSearch }: RequestListProps) {
  return (
    <ul className="flex flex-col gap-3" aria-label="Solicitudes">
      {requests.map((request) => (
        <li key={request.id}>
          <RequestListItem request={request} listSearch={listSearch} />
        </li>
      ))}
    </ul>
  );
}
