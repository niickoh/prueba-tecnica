import { formatMonth } from '../../../lib/format';
import { PRIORITY, RESOLUTION_STATUS, WORKFLOW_STATUS } from '../../requests/data/labels';
import type { DistributionRow, RequestMetrics } from '../types';

/** Mantiene el orden natural del enum (no se reordena por valor: el color/posición sigue a la entidad). */
function fromRecord<K extends string>(
  counts: Partial<Record<K, number>>,
  labels: Record<K, { label: string }>,
): DistributionRow[] {
  return (Object.keys(labels) as K[]).map((key) => ({
    key,
    label: labels[key].label,
    value: counts[key] ?? 0,
  }));
}

/** Completa con 0 los meses sin solicitudes, para que la tendencia no se comprima. */
export function fillMonthGaps(months: RequestMetrics['byMonth']): RequestMetrics['byMonth'] {
  const first = months[0];
  const last = months.at(-1);
  if (!first || !last) return [];

  const counts = new Map(months.map(({ month, count }) => [month, count]));
  const filled: RequestMetrics['byMonth'] = [];
  let [year = 0, month = 0] = first.month.split('-').map(Number);
  for (let key = first.month; key <= last.month;) {
    filled.push({ month: key, count: counts.get(key) ?? 0 });
    month = month === 12 ? 1 : month + 1;
    year = month === 1 ? year + 1 : year;
    key = `${year}-${String(month).padStart(2, '0')}`;
  }
  return filled;
}

export function toDistributions(metrics: RequestMetrics) {
  return {
    byWorkflowStatus: fromRecord(metrics.byWorkflowStatus, WORKFLOW_STATUS),
    byResolutionStatus: fromRecord(metrics.byResolutionStatus, RESOLUTION_STATUS),
    byPriority: fromRecord(metrics.byPriority, PRIORITY),
    byCategory: metrics.byCategory.map((category) => ({
      key: category.categoryId,
      label: category.description,
      value: category.count,
    })),
    byMonth: fillMonthGaps(metrics.byMonth).map(({ month, count }) => ({
      key: month,
      label: formatMonth(month),
      value: count,
    })),
  };
}
