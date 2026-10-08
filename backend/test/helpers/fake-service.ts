import categories from '../../../moks/categorias';
import workflows from '../../../moks/flujos';
import resolutions from '../../../moks/resoluciones';
import user from '../../../moks/usuarios';
import restrictions from '../../../moks/usuarios/restricciones';
import userRequests from '../../../moks/usuarios/solicitudes';
import type { OperationsServiceClient } from '../../src/infrastructure/services/operations-service-client';

type Dataset = {
  user: unknown;
  restrictions: Record<string, unknown>;
  requests: Record<string, unknown[]>;
  categories: Record<string, unknown>;
  workflows: Record<string, unknown>;
  resolutions: Record<string, unknown>;
};

/** Mismos datos que usa `Service`, leídos de `moks/` sin modificarlos. */
export const mockDataset = (): Dataset => ({
  user,
  restrictions,
  requests: userRequests,
  categories,
  workflows,
  resolutions,
});

/** Dataset sintético para probar volumen (p. ej. más de un lote de 100). */
export function largeDataset(count: number): Dataset {
  const statuses = ['in_review', 'pending_information', 'approved', 'rejected'] as const;
  const priorities = ['high', 'medium', 'low'] as const;
  const categoryIds = ['ACCESS', 'DATA', 'FINANCE'] as const;
  const requests = Array.from({ length: count }, (_, index) => ({
    request_id: 1000 + index,
    subject: `Solicitud ${index}`,
    priority: priorities[index % priorities.length],
    category_id: categoryIds[index % categoryIds.length],
    created_at: '2022-07-25T10:23:18.000-03:00',
    requester: { id: 1, name: 'Ana', area: 'Ops' },
    workflow_id: 5000 + index,
    resolution_id: 9000 + index,
  }));

  return {
    ...mockDataset(),
    requests: { 1: requests },
    workflows: Object.fromEntries(
      requests.map((request, index) => [
        request.workflow_id,
        { workflow_id: request.workflow_id, status: statuses[index % statuses.length] },
      ]),
    ),
    resolutions: Object.fromEntries(
      requests.map((request) => [
        request.resolution_id,
        { resolution_id: request.resolution_id, status: 'pending' },
      ]),
    ),
  };
}

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

/**
 * Doble de `Service` sin latencia, con la misma semántica de errores
 * (400 por paginación inválida o fuera de rango, 404 por id inexistente).
 * Cuenta las llamadas para verificar que no hay peticiones redundantes.
 */
export class FakeService implements OperationsServiceClient {
  readonly calls: string[] = [];

  constructor(private readonly data: Dataset = mockDataset()) {}

  count(method: string): number {
    return this.calls.filter((call) => call === method).length;
  }

  async getUser() {
    this.calls.push('getUser');
    return this.data.user;
  }

  async getUserRestrictions(userId: string | number) {
    this.calls.push('getUserRestrictions');
    return this.find(this.data.restrictions, userId);
  }

  async getUserRequests(userId: string | number, limit = 10, page = 1) {
    this.calls.push('getUserRequests');
    if (!Number.isInteger(limit) || !Number.isInteger(page) || limit < 1 || page < 1) {
      throw httpError(400, 'Bad request');
    }
    const requests = this.find(this.data.requests, userId) as unknown[];
    const offset = (page - 1) * limit;
    if (offset >= requests.length) {
      throw httpError(400, 'Bad request');
    }
    return { total: requests.length, offset, limit, data: requests.slice(offset, offset + limit) };
  }

  async getCategory(categoryId: string | number) {
    this.calls.push('getCategory');
    return this.find(this.data.categories, categoryId);
  }

  async getWorkflow(workflowId: string | number) {
    this.calls.push('getWorkflow');
    return this.find(this.data.workflows, workflowId);
  }

  async getResolution(resolutionId: string | number) {
    this.calls.push('getResolution');
    return this.find(this.data.resolutions, resolutionId);
  }

  private find(records: Record<string, unknown>, id: string | number) {
    if (!(id in records)) {
      throw httpError(404, `Not found: ${id}`);
    }
    return records[id];
  }
}
