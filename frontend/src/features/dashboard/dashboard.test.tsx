import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { metrics } from '../../test/fixtures';
import { deferred, mockApi } from '../../test/mockApi';
import { renderApp } from '../../test/renderApp';

describe('Dashboard', () => {
  it('shows the headline indicators', async () => {
    mockApi({ '/api/users/1/requests/metrics': { body: metrics } });
    renderApp('/');

    const kpis = await screen.findByRole('region', {
      name: 'Indicadores principales',
    });

    expect(within(kpis).getByText('Solicitudes').closest('div')).toHaveTextContent('10');
    expect(within(kpis).getByText('Flujos abiertos')).toBeInTheDocument();
    expect(within(kpis).getByText(/^83\s?%$/)).toBeInTheDocument();
  });

  it('shows the distribution by workflow status, priority, category and month', async () => {
    mockApi({ '/api/users/1/requests/metrics': { body: metrics } });
    renderApp('/');

    const byStatus = await screen.findByRole('list', {
      name: 'Solicitudes por estado del flujo',
    });
    const approved = within(byStatus).getByText('Aprobada').closest('li');
    expect(approved).toHaveTextContent(/5 · 50\s?%/);

    const byCategory = screen.getByRole('list', {
      name: 'Solicitudes por categoría',
    });
    expect(within(byCategory).getAllByRole('listitem')).toHaveLength(3);

    const byPriority = screen.getByRole('list', {
      name: 'Solicitudes por prioridad',
    });
    expect(within(byPriority).getByText('Alta').closest('li')).toHaveTextContent(/4 · 40\s?%/);

    const byMonth = screen.getByRole('list', { name: 'Solicitudes por mes' });
    expect(within(byMonth).getByText(/solicitudes en jul 2022/)).toBeInTheDocument();
    // abr y jul vienen de la API; may y jun se completan con 0 para no comprimir la tendencia.
    expect(within(byMonth).getAllByRole('listitem')).toHaveLength(4);
    expect(within(byMonth).getByText(/solicitudes en may 2022/).parentElement).toHaveTextContent(
      /^0 solicitudes/,
    );
  });

  it('shows a loading state while the metrics arrive', async () => {
    const pending = deferred({ body: metrics });
    mockApi({ '/api/users/1/requests/metrics': pending.handler });
    renderApp('/');

    expect(await screen.findByText('Calculando métricas…')).toBeInTheDocument();
    pending.release();
    expect(await screen.findByRole('region', { name: 'Indicadores principales' })).toBeVisible();
  });

  it('shows an error with a retry action when the metrics fail', async () => {
    let attempts = 0;
    mockApi({
      '/api/users/1/requests/metrics': () => {
        attempts += 1;
        return attempts === 1
          ? {
              status: 502,
              body: { error: { code: 'UPSTREAM_SERVICE_ERROR', message: 'x' } },
            }
          : { body: metrics };
      },
    });
    const { user } = renderApp('/');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No pudimos cargar las métricas');
    expect(alert).toHaveTextContent('La fuente de datos no está disponible');

    await user.click(within(alert).getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('region', { name: 'Indicadores principales' })).toBeVisible();
  });
});
