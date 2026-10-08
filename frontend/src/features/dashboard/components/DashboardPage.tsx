import { ButtonLink } from '../../../shared/ui/ButtonLink';
import { ErrorState } from '../../../shared/ui/ErrorState';
import { LoadingState } from '../../../shared/ui/LoadingState';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { useCurrentUser } from '../../session/hooks/useCurrentUser';
import { useDashboard } from '../hooks/useDashboard';
import { BarList } from './charts/BarList';
import { MonthlyColumns } from './charts/MonthlyColumns';
import { ChartCard } from './ChartCard';
import { KpiGrid } from './kpis/KpiGrid';

export function DashboardPage() {
  const user = useCurrentUser();
  const { metrics, distributions } = useDashboard(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Volumen y distribución de las solicitudes operativas."
        />
        <ButtonLink to="/requests" variant="primary" className="self-start sm:self-auto">
          Ver solicitudes
        </ButtonLink>
      </div>

      {metrics.status === 'loading' && <LoadingState label="Calculando métricas…" />}
      {metrics.status === 'error' && (
        <ErrorState
          title="No pudimos cargar las métricas"
          error={metrics.error}
          onRetry={metrics.retry}
        />
      )}
      {metrics.status === 'success' && distributions && (
        <>
          <KpiGrid metrics={metrics.data} />
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Por estado del flujo"
              description="Dónde está cada solicitud en su aprobación."
            >
              <BarList
                label="Solicitudes por estado del flujo"
                rows={distributions.byWorkflowStatus}
              />
            </ChartCard>
            <ChartCard title="Por estado de resolución" description="Avance de la ejecución.">
              <BarList
                label="Solicitudes por estado de resolución"
                rows={distributions.byResolutionStatus}
              />
            </ChartCard>
            <ChartCard title="Por prioridad" description="Urgencia del volumen actual.">
              <BarList label="Solicitudes por prioridad" rows={distributions.byPriority} />
            </ChartCard>
            <ChartCard title="Por categoría" description="Dónde se concentra la demanda.">
              <BarList label="Solicitudes por categoría" rows={distributions.byCategory} />
            </ChartCard>
            <ChartCard
              title="Evolución mensual"
              description="Solicitudes creadas por mes."
              className="md:col-span-2"
            >
              <MonthlyColumns rows={distributions.byMonth} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
