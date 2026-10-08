import { useEffect, type ReactNode } from 'react';
import { ErrorState } from '../../../shared/ui/ErrorState';
import { LoadingState } from '../../../shared/ui/LoadingState';
import { useSessionStore } from '../hooks/useSessionStore';

/** Carga la sesión una vez y sólo renderiza la app cuando hay usuario. */
export function SessionGate({ children }: { children: ReactNode }) {
  const status = useSessionStore((state) => state.status);
  const error = useSessionStore((state) => state.error);
  const loadSession = useSessionStore((state) => state.loadSession);

  useEffect(() => {
    if (useSessionStore.getState().status === 'idle') {
      void loadSession();
    }
  }, [loadSession]);

  if (status === 'error' && error) {
    return <ErrorState title="No pudimos cargar tu sesión" error={error} onRetry={loadSession} />;
  }
  if (status !== 'ready') {
    return <LoadingState label="Cargando sesión…" />;
  }
  return children;
}
