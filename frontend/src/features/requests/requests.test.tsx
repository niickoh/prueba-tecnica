import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildRequest, filterOptions, page, requestDetail } from '../../test/fixtures';
import { deferred, mockApi, requestedUrls } from '../../test/mockApi';
import { renderApp } from '../../test/renderApp';
import { createFiltersSchema } from './hooks/useFiltersForm';

const LIST = '/api/users/1/requests';

describe('Requests list', () => {
  it('shows identifier, subject, requester, category, priority, workflow status and creation date', async () => {
    mockApi({ [LIST]: { body: page([buildRequest()]) } });
    renderApp('/requests');

    const item = await screen.findByRole('article');

    expect(item).toHaveTextContent('#300200');
    expect(
      within(item).getByRole('link', {
        name: 'Acceso temporal a reportes regionales',
      }),
    ).toBeVisible();
    expect(item).toHaveTextContent('Jordan Lee');
    expect(item).toHaveTextContent('Accesos y permisos');
    expect(item).toHaveTextContent('Prioridad: Alta');
    expect(item).toHaveTextContent('Estado del flujo: Pendiente de información');
    expect(within(item).getByText(/25 jul 2022/)).toHaveAttribute(
      'datetime',
      '2022-07-25T10:23:18.000-03:00',
    );
  });

  it('shows a loading state and then the results count', async () => {
    const pending = deferred({ body: page([buildRequest()]) });
    mockApi({ [LIST]: pending.handler });
    renderApp('/requests');

    expect(await screen.findByText('Cargando solicitudes…')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Resultados' })).toHaveAttribute('aria-busy', 'true');
    pending.release();
    expect(await screen.findByText('1 solicitud')).toBeInTheDocument();
  });

  it('shows an error state with retry', async () => {
    let attempts = 0;
    mockApi({
      [LIST]: () => {
        attempts += 1;
        return attempts === 1
          ? {
              status: 500,
              body: { error: { code: 'INTERNAL_ERROR', message: 'x' } },
            }
          : { body: page([buildRequest()]) };
      },
    });
    const { user } = renderApp('/requests');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No pudimos cargar las solicitudes');
    await user.click(within(alert).getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('article')).toBeVisible();
  });

  it('shows an empty state and lets the user clear the filters', async () => {
    const fetchMock = mockApi({
      [LIST]: (url) => ({
        body: url.searchParams.has('priority') ? page([]) : page([buildRequest()]),
      }),
    });
    const { user } = renderApp('/requests?priority=low');

    expect(await screen.findByText('No hay solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Ninguna solicitud coincide con los filtros aplicados.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    expect(await screen.findByRole('article')).toBeVisible();
    expect(requestedUrls(fetchMock, LIST).at(-1)?.searchParams.has('priority')).toBe(false);
  });

  it('applies status, priority and category filters and goes back to the first page', async () => {
    const fetchMock = mockApi({ [LIST]: { body: page([buildRequest()]) } });
    const { user, router } = renderApp('/requests?page=2');
    await screen.findByRole('article');

    await user.selectOptions(await screen.findByLabelText('Estado del flujo'), 'Aprobada');
    await user.selectOptions(screen.getByLabelText('Prioridad'), 'Alta');
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Datos maestros');
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    await screen.findByRole('article');
    const lastQuery = requestedUrls(fetchMock, LIST).at(-1)?.searchParams;
    expect(lastQuery?.get('status')).toBe('approved');
    expect(lastQuery?.get('priority')).toBe('high');
    expect(lastQuery?.get('category')).toBe('DATA');
    expect(lastQuery?.get('page')).toBe('1');
    expect(router.state.location.search).toBe('?status=approved&priority=high&category=DATA');
  });

  it('paginates keeping the active filters', async () => {
    const fetchMock = mockApi({
      [LIST]: (url) => {
        const current = Number(url.searchParams.get('page'));
        return {
          body: page([buildRequest({ id: 300000 + current })], {
            page: current,
            total: 25,
            totalPages: 3,
          }),
        };
      },
    });
    const { user } = renderApp('/requests?status=in_review');
    await screen.findByText('#300001');

    await user.click(screen.getByRole('button', { name: /Siguiente/ }));

    expect(await screen.findByText('#300002')).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toHaveTextContent(
      'Página 2 de 3',
    );
    const lastQuery = requestedUrls(fetchMock, LIST).at(-1)?.searchParams;
    expect(lastQuery?.get('page')).toBe('2');
    expect(lastQuery?.get('status')).toBe('in_review');
  });

  it('rejects filter values that are not in the available options', () => {
    const schema = createFiltersSchema(filterOptions);

    const result = schema.safeParse({
      status: 'done',
      priority: '',
      category: 'FINANCE',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Elegí un estado del flujo de la lista.',
      'Elegí una categoría de la lista.',
    ]);
  });
});

describe('Request detail', () => {
  it('opens from the list and shows every field including the resolution status', async () => {
    mockApi({
      [LIST]: { body: page([buildRequest()]) },
      '/api/users/1/requests/300200': { body: requestDetail },
    });
    const { user } = renderApp('/requests');

    await user.click(
      await screen.findByRole('link', {
        name: 'Acceso temporal a reportes regionales',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Acceso temporal a reportes regionales',
      }),
    ).toBeVisible();
    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    expect(terms).toEqual([
      'Estado del flujo',
      'Estado de resolución',
      'Prioridad',
      'Categoría',
      'Identificador',
      'Fecha de creación',
      'Solicitante',
    ]);
    expect(screen.getByText('#300200')).toBeVisible();
    expect(screen.getByText('Jordan Lee')).toBeVisible();
    expect(screen.getByText('En progreso')).toBeVisible();
    expect(screen.getByText('Pendiente de información')).toBeVisible();
  });

  it('goes back to the list keeping the filters', async () => {
    mockApi({
      [LIST]: { body: page([buildRequest()]) },
      '/api/users/1/requests/300200': { body: requestDetail },
    });
    const { user, router } = renderApp('/requests?priority=high');

    await user.click(
      await screen.findByRole('link', {
        name: 'Acceso temporal a reportes regionales',
      }),
    );
    await user.click(await screen.findByRole('link', { name: /Volver al listado/ }));

    expect(router.state.location.pathname).toBe('/requests');
    expect(router.state.location.search).toBe('?priority=high');
  });

  it('shows a not found message for an unknown request', async () => {
    mockApi({
      '/api/users/1/requests/999': {
        status: 404,
        body: {
          error: { code: 'NOT_FOUND', message: 'Request "999" was not found' },
        },
      },
    });
    renderApp('/requests/999');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No encontramos lo que buscabas.');
    expect(screen.getByRole('link', { name: /Volver al listado/ })).toHaveAttribute(
      'href',
      '/requests',
    );
  });
});
