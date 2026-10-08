import { apiGet } from '../../../lib/http';
import { metricsSchema } from '../types';

export const fetchMetrics = (userId: number, signal?: AbortSignal) =>
  apiGet(`/users/${userId}/requests/metrics`, metricsSchema, { signal });
