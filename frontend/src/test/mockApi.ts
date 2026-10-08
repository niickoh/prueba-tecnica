import { vi } from 'vitest';
import { filterOptions, user } from './fixtures';

export interface MockResponse {
  status?: number;
  body: unknown;
}

type Handler = MockResponse | ((url: URL) => MockResponse | Promise<MockResponse>);

/**
 * Reemplaza `fetch` por un enrutador en memoria: `{ '/api/users/me': {...} }`.
 * Incluye por defecto el usuario, sin restricciones y las opciones de filtro.
 */
export function mockApi(handlers: Record<string, Handler> = {}) {
  const routes: Record<string, Handler> = {
    '/api/users/me': { body: user },
    '/api/users/1/restrictions': { body: [] },
    '/api/users/1/requests/filter-options': { body: filterOptions },
    ...handlers,
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const handler = routes[url.pathname];
    const response: MockResponse = !handler
      ? {
          status: 404,
          body: { error: { code: 'ROUTE_NOT_FOUND', message: 'Not mocked' } },
        }
      : typeof handler === 'function'
        ? await handler(url)
        : handler;

    return new Response(JSON.stringify(response.body), {
      status: response.status ?? 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** URLs pedidas a un endpoint (para verificar los query params enviados). */
export function requestedUrls(fetchMock: ReturnType<typeof mockApi>, pathname: string): URL[] {
  return fetchMock.mock.calls
    .map(([input]) => new URL(input instanceof Request ? input.url : String(input)))
    .filter((url) => url.pathname === pathname);
}

/** Respuesta que queda pendiente hasta llamar a `release()` (para observar estados de carga). */
export function deferred(response: MockResponse) {
  let release = () => {};
  const promise = new Promise<MockResponse>((resolve) => {
    release = () => resolve(response);
  });
  return { handler: () => promise, release };
}
