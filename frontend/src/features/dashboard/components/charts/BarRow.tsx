import { formatPercent } from '../../../../lib/format';
import type { DistributionRow } from '../../types';

interface BarRowProps {
  row: DistributionRow;
  max: number;
  total: number;
}

/** Barra horizontal con etiqueta directa (valor y porcentaje siempre visibles). */
export function BarRow({ row, max, total }: BarRowProps) {
  const share = total === 0 ? 0 : row.value / total;
  const width = max === 0 ? 0 : (row.value / max) * 100;

  return (
    <li className="group relative flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink">{row.label}</span>
        <span className="text-ink-secondary tabular-nums">
          <span className="font-semibold text-ink">{row.value}</span> · {formatPercent(share)}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-r bg-surface-sunken" aria-hidden="true">
        <div
          className="h-full rounded-r bg-series-1 transition-opacity group-hover:opacity-80"
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 hidden rounded-md bg-ink px-2 py-1 text-xs text-page shadow group-hover:block"
      >
        {row.label}: {row.value} de {total}
      </span>
    </li>
  );
}
