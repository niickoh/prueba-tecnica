import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../app/routes';

/** Renderiza la app completa (layout + rutas reales) en una URL inicial. */
export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  const user = userEvent.setup();
  const view = render(<RouterProvider router={router} />);
  return { ...view, user, router };
}
