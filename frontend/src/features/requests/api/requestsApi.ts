import { apiGet } from '../../../lib/http';
import {
  filterOptionsSchema,
  paginatedRequestsSchema,
  requestDetailSchema,
  type RequestFilters,
} from '../types';

interface ListParams extends RequestFilters {
  page: number;
  limit: number;
}

export const fetchRequests = (userId: number, params: ListParams, signal?: AbortSignal) =>
  apiGet(`/users/${userId}/requests`, paginatedRequestsSchema, {
    signal,
    query: { ...params },
  });

export const fetchRequestDetail = (userId: number, requestId: number, signal?: AbortSignal) =>
  apiGet(`/users/${userId}/requests/${requestId}`, requestDetailSchema, {
    signal,
  });

export const fetchFilterOptions = (userId: number, signal?: AbortSignal) =>
  apiGet(`/users/${userId}/requests/filter-options`, filterOptionsSchema, {
    signal,
  });
