import { PageHeader } from '../../../shared/ui/PageHeader';
import { useCurrentUser } from '../../session/hooks/useCurrentUser';
import { useRequestSearchParams } from '../hooks/useRequestSearchParams';
import { RequestFiltersPanel } from './filters/RequestFiltersPanel';
import { RequestResults } from './list/RequestResults';

export function RequestsPage() {
  const user = useCurrentUser();
  const { filters, page, applyFilters, goToPage, search } = useRequestSearchParams();
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Solicitudes"
        description="Consultá y filtrá las solicitudes operativas por estado, prioridad y categoría."
      />
      <RequestFiltersPanel userId={user.id} filters={filters} onApply={applyFilters} />
      <RequestResults
        userId={user.id}
        filters={filters}
        page={page}
        listSearch={search}
        hasActiveFilters={hasActiveFilters}
        onPageChange={goToPage}
        onClearFilters={() => applyFilters({})}
      />
    </div>
  );
}
