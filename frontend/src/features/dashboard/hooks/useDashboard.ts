import { useMemo } from 'react';
import { useAsync } from '../../../shared/hooks/useAsync';
import { fetchMetrics } from '../api/dashboardApi';
import { toDistributions } from '../data/toDistributions';

export function useDashboard(userId: number) {
  const metrics = useAsync(`metrics:${userId}`, (signal) => fetchMetrics(userId, signal));
  const distributions = useMemo(
    () => (metrics.status === 'success' ? toDistributions(metrics.data) : null),
    [metrics],
  );
  return { metrics, distributions };
}
