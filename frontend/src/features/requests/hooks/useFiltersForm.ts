import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { FilterOptions, RequestFilters } from '../types';

/** `''` en un select significa "todos". */
function oneOf(values: readonly string[], message: string) {
  return z.string().refine((value) => value === '' || values.includes(value), { message });
}

export function createFiltersSchema(options: FilterOptions) {
  return z.object({
    status: oneOf(options.workflowStatuses, 'Elegí un estado del flujo de la lista.'),
    priority: oneOf(options.priorities, 'Elegí una prioridad de la lista.'),
    category: oneOf(
      options.categories.map((category) => category.id),
      'Elegí una categoría de la lista.',
    ),
  });
}

export type FiltersFormValues = z.infer<ReturnType<typeof createFiltersSchema>>;

const toFormValues = (filters: RequestFilters): FiltersFormValues => ({
  status: filters.status ?? '',
  priority: filters.priority ?? '',
  category: filters.category ?? '',
});

/**
 * Formulario de filtros: valida con Zod al salir de cada campo, enfoca el primer
 * campo inválido al enviar y se mantiene sincronizado con la URL.
 */
export function useFiltersForm(
  options: FilterOptions,
  filters: RequestFilters,
  onApply: (filters: RequestFilters) => void,
) {
  const schema = useMemo(() => createFiltersSchema(options), [options]);
  const values = useMemo(() => toFormValues(filters), [filters]);

  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    values,
    shouldFocusError: true,
  });

  const submit = form.handleSubmit((data) => {
    onApply({
      status: options.workflowStatuses.find((status) => status === data.status),
      priority: options.priorities.find((priority) => priority === data.priority),
      category: data.category || undefined,
    });
  });

  const clear = () => {
    form.reset(toFormValues({}));
    onApply({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return { form, submit, clear, hasActiveFilters };
}
