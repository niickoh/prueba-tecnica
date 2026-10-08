import type { DistributionRow } from '../../types';

const PLOT_HEIGHT_REM = 9;

/** Columnas por mes con el valor sobre cada columna y una línea base común. */
export function MonthlyColumns({ rows }: { rows: DistributionRow[] }) {
  const max = Math.max(0, ...rows.map((row) => row.value));

  return (
    <ol aria-label="Solicitudes por mes" className="flex items-end gap-2 border-b border-grid pt-6">
      {rows.map((row) => {
        const height = max === 0 ? 0 : (row.value / max) * PLOT_HEIGHT_REM;
        return (
          <li key={row.key} className="group flex min-w-0 flex-1 flex-col items-center gap-1">
            <span className="text-sm font-semibold text-ink tabular-nums">
              {row.value}
              <span className="sr-only"> solicitudes en {row.label}</span>
            </span>
            <div
              aria-hidden="true"
              className="w-full max-w-12 rounded-t bg-series-1 transition-opacity group-hover:opacity-80"
              style={{ height: `${height}rem` }}
            />
            <span aria-hidden="true" className="truncate pb-1 text-xs text-ink-secondary">
              {row.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
