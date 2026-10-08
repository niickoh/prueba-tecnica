import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { metrics } from '../../test/fixtures';
import { mockApi } from '../../test/mockApi';
import { renderApp } from '../../test/renderApp';

describe('Session', () => {
  it('shows the current operator in the header', async () => {
    mockApi({ '/api/users/1/requests/metrics': { body: metrics } });
    renderApp('/');

    expect(await screen.findByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Operaciones')).toBeInTheDocument();
  });

  it('shows the account restrictions as a notice', async () => {
    mockApi({
      '/api/users/1/requests/metrics': { body: metrics },
      '/api/users/1/restrictions': {
        body: [{ type: 'warning', message: 'Tu cuenta no ha sido verificada aún' }],
      },
    });
    renderApp('/');

    expect(await screen.findByText('Tu cuenta no ha sido verificada aún')).toBeVisible();
    expect(screen.getByText('Aviso:')).toBeInTheDocument();
  });

  it('shows an error with retry when the session cannot be loaded', async () => {
    mockApi({
      '/api/users/me': {
        status: 502,
        body: { error: { code: 'X', message: 'x' } },
      },
    });
    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tu sesión');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  });

  it('shows a not found page for unknown routes', async () => {
    mockApi();
    renderApp('/nope');

    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
  });
});
