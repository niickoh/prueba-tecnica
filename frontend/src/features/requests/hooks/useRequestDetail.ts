import { useAsync } from '../../../shared/hooks/useAsync';
import { ApiError } from '../../../lib/http';
import { fetchRequestDetail } from '../api/requestsApi';

/** Un id no numérico en la URL se trata como "no encontrada" sin llamar a la API. */
export function useRequestDetail(userId: number, rawRequestId: string | undefined) {
  const requestId = Number(rawRequestId);
  const isValidId = Number.isInteger(requestId) && requestId > 0;

  return useAsync(`request:${userId}:${rawRequestId}`, (signal) =>
    isValidId
      ? fetchRequestDetail(userId, requestId, signal)
      : Promise.reject(new ApiError(404, 'NOT_FOUND', 'Request not found')),
  );
}
