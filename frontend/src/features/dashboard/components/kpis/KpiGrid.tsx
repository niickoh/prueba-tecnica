import { formatPercent } from '../../../../lib/format';
import type { RequestMetrics } from '../../types';
import { StatTile } from './StatTile';

export function KpiGrid({ metrics }: { metrics: RequestMetrics }) {
  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">
        Indicadores principales
      </h2>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
        <StatTile label="Solicitudes" value={String(metrics.total)} hint="Volumen total" />
        <StatTile
          label="Flujos abiertos"
          value={String(metrics.openWorkflows)}
          hint="En revisión o pendientes de información"
        />
        <StatTile
          label="Pendientes de información"
          value={String(metrics.pendingInformation)}
          hint="Bloqueadas hasta recibir datos"
        />
        <StatTile
          label="Alta prioridad sin resolver"
          value={String(metrics.highPriorityUnresolved)}
          hint="Resolución pendiente o en progreso"
        />
        <StatTile
          label="Tasa de aprobación"
          value={metrics.approvalRate === null ? '—' : formatPercent(metrics.approvalRate)}
          hint="Aprobadas sobre decididas"
        />
      </dl>
    </section>
  );
}
