import { z } from 'zod';
import { API_BASE_URL } from './config';

const errorBodySchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type QueryValue = string | number | undefined;

interface GetOptions {
  signal?: AbortSignal;
  query?: Record<string, QueryValue>;
}

function buildUrl(path: string, query: Record<string, QueryValue> = {}): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * GET tipado: la respuesta se valida con un esquema Zod, así que el resto
 * de la app nunca trabaja con datos sin verificar.
 */
export async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  { signal, query }: GetOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = errorBodySchema.safeParse(body);
    throw parsed.success
      ? new ApiError(response.status, parsed.data.error.code, parsed.data.error.message)
      : new ApiError(response.status, 'HTTP_ERROR', `HTTP ${response.status}`);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Respuesta inesperada del servidor');
  }
  return parsed.data;
}
