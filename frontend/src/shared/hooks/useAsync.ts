import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error };

type Settled<T> = Exclude<AsyncState<T>, { status: 'loading' }>;

/**
 * Ejecuta `load` cada vez que cambia `key` y cancela la petición anterior
 * (evita condiciones de carrera al cambiar de página o de filtros).
 */
export function useAsync<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
): AsyncState<T> & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    state: Settled<T>;
  } | null>(null);
  const loadRef = useRef(load);
  const requestKey = `${key}#${attempt}`;

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    const controller = new AbortController();
    loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setResult({ key: requestKey, state: { status: 'success', data } });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        const normalized = error instanceof Error ? error : new Error(String(error));
        setResult({
          key: requestKey,
          state: { status: 'error', error: normalized },
        });
      },
    );
    return () => controller.abort();
  }, [requestKey]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const state: AsyncState<T> = result?.key === requestKey ? result.state : { status: 'loading' };
  return { ...state, retry };
}
