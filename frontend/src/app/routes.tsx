import type { RouteObject } from 'react-router';
import { DashboardPage } from '../features/dashboard/components/DashboardPage';
import { RequestDetailPage } from '../features/requests/components/detail/RequestDetailPage';
import { RequestsPage } from '../features/requests/components/RequestsPage';
import { NotFoundPage } from './NotFoundPage';
import { RootLayout } from './RootLayout';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'requests/:requestId', element: <RequestDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
