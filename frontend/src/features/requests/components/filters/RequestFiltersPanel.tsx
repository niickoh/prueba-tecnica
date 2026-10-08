import { Card } from '../../../../shared/ui/Card';
import { ErrorState } from '../../../../shared/ui/ErrorState';
import { LoadingState } from '../../../../shared/ui/LoadingState';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import type { RequestFilters as Filters } from '../../types';
import { RequestFilters } from './RequestFilters';

interface RequestFiltersPanelProps {
  userId: number;
  filters: Filters;
  onApply: (filters: Filters) => void;
}

export function RequestFiltersPanel({ userId, filters, onApply }: RequestFiltersPanelProps) {
  const options = useFilterOptions(userId);

  return (
    <Card aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="sr-only">
        Filtros
      </h2>
      {options.status === 'loading' && <LoadingState label="Cargando filtros…" />}
      {options.status === 'error' && (
        <ErrorState
          title="No pudimos cargar los filtros"
          error={options.error}
          onRetry={options.retry}
        />
      )}
      {options.status === 'success' && (
        <RequestFilters options={options.data} filters={filters} onApply={onApply} />
      )}
    </Card>
  );
}
