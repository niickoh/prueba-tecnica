import { Button } from '../../../../shared/ui/Button';
import { Select } from '../../../../shared/ui/Select';
import { PRIORITY, WORKFLOW_STATUS } from '../../data/labels';
import { useFiltersForm } from '../../hooks/useFiltersForm';
import type { FilterOptions, RequestFilters as Filters } from '../../types';

interface RequestFiltersProps {
  options: FilterOptions;
  filters: Filters;
  onApply: (filters: Filters) => void;
}

export function RequestFilters({ options, filters, onApply }: RequestFiltersProps) {
  const { form, submit, clear, hasActiveFilters } = useFiltersForm(options, filters, onApply);
  const { errors } = form.formState;

  return (
    <form
      aria-label="Filtros de solicitudes"
      noValidate
      onSubmit={submit}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end"
    >
      <Select
        label="Estado del flujo"
        placeholder="Todos los estados"
        options={options.workflowStatuses.map((status) => ({
          value: status,
          label: WORKFLOW_STATUS[status].label,
        }))}
        error={errors.status?.message}
        {...form.register('status')}
      />
      <Select
        label="Prioridad"
        placeholder="Todas las prioridades"
        options={options.priorities.map((priority) => ({
          value: priority,
          label: PRIORITY[priority].label,
        }))}
        error={errors.priority?.message}
        {...form.register('priority')}
      />
      <Select
        label="Categoría"
        placeholder="Todas las categorías"
        options={options.categories.map((category) => ({
          value: category.id,
          label: category.description,
        }))}
        error={errors.category?.message}
        {...form.register('category')}
      />
      <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
        <Button type="submit" className="flex-1 lg:flex-none">
          Aplicar filtros
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clear}>
            Limpiar
          </Button>
        )}
      </div>
    </form>
  );
}
