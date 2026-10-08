import type { RequestMetrics } from '../features/dashboard/types';
import type { FilterOptions, RequestDetail, RequestSummary } from '../features/requests/types';
import type { User } from '../features/session/types';

export const user: User = {
  id: 1,
  name: 'Alex',
  surname: 'Morgan',
  fullName: 'Alex Morgan',
  area: 'Operaciones',
  profileImage: 'https://example.com/avatar.png',
};

export const filterOptions: FilterOptions = {
  workflowStatuses: ['in_review', 'pending_information', 'approved', 'rejected'],
  priorities: ['high', 'medium', 'low'],
  categories: [
    { id: 'ACCESS', description: 'Accesos y permisos' },
    { id: 'DATA', description: 'Datos maestros' },
  ],
};

export function buildRequest(overrides: Partial<RequestSummary> = {}): RequestSummary {
  return {
    id: 300200,
    subject: 'Acceso temporal a reportes regionales',
    priority: 'high',
    createdAt: '2022-07-25T10:23:18.000-03:00',
    requester: { id: 4010, name: 'Jordan Lee', area: 'Planificación' },
    category: { id: 'ACCESS', description: 'Accesos y permisos' },
    workflow: { id: 1000010200, status: 'pending_information' },
    ...overrides,
  };
}

export const requestDetail: RequestDetail = {
  ...buildRequest(),
  resolution: { id: 7010200, status: 'in_progress' },
};

export function page(
  data: RequestSummary[],
  pagination: Partial<{ page: number; total: number; totalPages: number }> = {},
) {
  return {
    data,
    pagination: {
      page: 1,
      limit: 10,
      total: data.length,
      totalPages: data.length === 0 ? 0 : 1,
      ...pagination,
    },
  };
}

export const metrics: RequestMetrics = {
  total: 10,
  openWorkflows: 4,
  pendingInformation: 2,
  highPriorityUnresolved: 2,
  approvalRate: 5 / 6,
  byWorkflowStatus: {
    in_review: 2,
    pending_information: 2,
    approved: 5,
    rejected: 1,
  },
  byResolutionStatus: { pending: 3, in_progress: 2, resolved: 4, cancelled: 1 },
  byPriority: { high: 4, medium: 4, low: 2 },
  byCategory: [
    { categoryId: 'ACCESS', description: 'Accesos y permisos', count: 4 },
    { categoryId: 'DATA', description: 'Datos maestros', count: 3 },
    {
      categoryId: 'FINANCE',
      description: 'Administración financiera',
      count: 3,
    },
  ],
  byMonth: [
    { month: '2022-04', count: 1 },
    { month: '2022-07', count: 6 },
  ],
};
