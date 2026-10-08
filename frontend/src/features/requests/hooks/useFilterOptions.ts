import { useAsync } from '../../../shared/hooks/useAsync';
import { fetchFilterOptions } from '../api/requestsApi';

export function useFilterOptions(userId: number) {
  return useAsync(`filter-options:${userId}`, (signal) => fetchFilterOptions(userId, signal));
}
