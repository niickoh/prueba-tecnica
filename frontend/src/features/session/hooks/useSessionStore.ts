import { create } from 'zustand';
import { fetchCurrentUser, fetchRestrictions } from '../api/sessionApi';
import type { Restriction, User } from '../types';

type SessionStatus = 'idle' | 'loading' | 'ready' | 'error';

interface SessionState {
  status: SessionStatus;
  user: User | null;
  error: Error | null;
  restrictions: Restriction[];
  loadSession: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  status: 'idle' as SessionStatus,
  user: null,
  error: null,
  restrictions: [],
};

/**
 * Estado global de la sesión: el operador actual (su id se usa en todas las
 * consultas) y sus avisos. Las restricciones tardan más en llegar, así que
 * se cargan sin bloquear la app.
 */
export const useSessionStore = create<SessionState>()((set, get) => ({
  ...initialState,

  loadSession: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const user = await fetchCurrentUser();
      set({ status: 'ready', user });
      fetchRestrictions(user.id).then(
        (restrictions) => set({ restrictions }),
        () => set({ restrictions: [] }),
      );
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  },

  reset: () => set(initialState),
}));
