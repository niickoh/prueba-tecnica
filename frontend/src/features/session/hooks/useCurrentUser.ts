import { useSessionStore } from './useSessionStore';
import type { User } from '../types';

/** Usuario actual. Sólo se usa debajo de `SessionGate`, que garantiza que existe. */
export function useCurrentUser(): User {
  const user = useSessionStore((state) => state.user);
  if (!user) {
    throw new Error('useCurrentUser must be used inside <SessionGate>');
  }
  return user;
}
