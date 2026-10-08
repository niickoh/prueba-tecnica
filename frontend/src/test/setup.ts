import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useSessionStore } from '../features/session/hooks/useSessionStore';

// jsdom no implementa scrollTo (lo usa <ScrollRestoration />).
window.scrollTo = () => {};

afterEach(() => {
  cleanup();
  useSessionStore.getState().reset();
  vi.unstubAllGlobals();
});
