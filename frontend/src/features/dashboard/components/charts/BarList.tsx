import type { DistributionRow } from '../../types';
import { BarRow } from './BarRow';

/** Una sola serie: todas las barras en el color del slot 1 (la longitud ya codifica el valor). */
export function BarList({ rows, label }: { rows: DistributionRow[]; label: string }) {
  const max = Math.max(0, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <ul aria-label={label} className="flex flex-col gap-3">
      {rows.map((row) => (
        <BarRow key={row.key} row={row} max={max} total={total} />
      ))}
    </ul>
  );
}
