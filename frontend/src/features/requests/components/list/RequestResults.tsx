import { Button } from '../../../../shared/ui/Button';
import { EmptyState } from '../../../../shared/ui/EmptyState';
import { ErrorState } from '../../../../shared/ui/ErrorState';
import { LoadingState } from '../../../../shared/ui/LoadingState';
import { Pagination } from '../../../../shared/ui/Pagination';
import { useRequestList } from '../../hooks/useRequestList';
import type { RequestFilters } from '../../types';
import { RequestList } from './RequestList';

interface RequestResultsProps {
  userId: number;
  filters: RequestFilters;
  page: number;
  listSearch: string;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function RequestResults({
  userId,
  filters,
  page,
  listSearch,
  hasActiveFilters,
  onPageChange,
  onClearFilters,
}: RequestResultsProps) {
  const result = useRequestList(userId, filters, page);

  return (
    <section
      aria-labelledby="results-heading"
      aria-busy={result.status === 'loading'}
      className="flex flex-col gap-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="results-heading" className="text-lg font-semibold text-ink">
          Resultados
        </h2>
        {result.status === 'success' && (
          <p className="text-sm text-ink-secondary" aria-live="polite">
            {result.data.pagination.total === 1
              ? '1 solicitud'
              : `${result.data.pagination.total} solicitudes`}
          </p>
        )}
      </div>

      {result.status === 'loading' && <LoadingState label="Cargando solicitudes…" />}

      {result.status === 'error' && (
        <ErrorState
          title="No pudimos cargar las solicitudes"
          error={result.error}
          onRetry={result.retry}
        />
      )}

      {result.status === 'success' && result.data.data.length === 0 && (
        <EmptyState
          title="No hay solicitudes"
          description={
            hasActiveFilters
              ? 'Ninguna solicitud coincide con los filtros aplicados.'
              : 'Todavía no hay solicitudes para mostrar.'
          }
          action={
            hasActiveFilters && (
              <Button variant="secondary" onClick={onClearFilters}>
                Limpiar filtros
              </Button>
            )
          }
        />
      )}

      {result.status === 'success' && result.data.data.length > 0 && (
        <>
          <RequestList requests={result.data.data} listSearch={listSearch} />
          <Pagination
            page={result.data.pagination.page}
            totalPages={result.data.pagination.totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}
