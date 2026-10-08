import { DEFAULT_PAGE_SIZE } from '../../../lib/config';
import { useAsync } from '../../../shared/hooks/useAsync';
import { fetchRequests } from '../api/requestsApi';
import type { RequestFilters } from '../types';

export function useRequestList(userId: number, filters: RequestFilters, page: number) {
  const params = { ...filters, page, limit: DEFAULT_PAGE_SIZE };
  return useAsync(`requests:${userId}:${JSON.stringify(params)}`, (signal) =>
    fetchRequests(userId, params, signal),
  );
}
