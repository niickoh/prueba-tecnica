import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { prioritySchema, workflowStatusSchema, type RequestFilters } from '../types';

/** Valores inválidos en la URL se ignoran en lugar de romper la vista. */
function parseFilters(params: URLSearchParams): RequestFilters {
  const status = workflowStatusSchema.safeParse(params.get('status'));
  const priority = prioritySchema.safeParse(params.get('priority'));
  const category = params.get('category')?.trim();
  return {
    status: status.success ? status.data : undefined,
    priority: priority.success ? priority.data : undefined,
    category: category || undefined,
  };
}

function parsePage(params: URLSearchParams): number {
  const page = Number(params.get('page'));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** Filtros y página viven en la URL: se pueden compartir y el "atrás" del navegador funciona. */
export function useRequestSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const page = parsePage(searchParams);

  const applyFilters = useCallback(
    (next: RequestFilters) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(next)) {
        if (value) params.set(key, value);
      }
      setSearchParams(params);
    },
    [setSearchParams],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        if (nextPage > 1) params.set('page', String(nextPage));
        else params.delete('page');
        return params;
      });
    },
    [setSearchParams],
  );

  return {
    filters,
    page,
    applyFilters,
    goToPage,
    search: searchParams.toString(),
  };
}
