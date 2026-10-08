/** Base de la API. En desarrollo Vite hace proxy de `/api` al backend. */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api';

export const DEFAULT_PAGE_SIZE = 10;
