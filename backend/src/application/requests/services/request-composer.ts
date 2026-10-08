import type { Category } from '../../../domain/requests/entities/category';
import type {
  ComposedRequest,
  ComposedRequestWithResolution,
} from '../../../domain/requests/entities/composed-request';
import type { OperationalRequest } from '../../../domain/requests/entities/operational-request';
import type { Resolution } from '../../../domain/requests/entities/resolution';
import type { Workflow } from '../../../domain/requests/entities/workflow';
import type { CategoryRepository } from '../ports/category-repository';
import type { ResolutionRepository } from '../ports/resolution-repository';
import type { WorkflowRepository } from '../ports/workflow-repository';

/** Obtiene cada id una sola vez y en paralelo; devuelve un índice id -> entidad. */
async function fetchUnique<K, V>(ids: readonly K[], fetch: (id: K) => Promise<V>) {
  const uniqueIds = [...new Set(ids)];
  const values = await Promise.all(uniqueIds.map(fetch));
  return new Map(uniqueIds.map((id, index) => [id, values[index] as V]));
}

function lookup<K, V>(index: Map<K, V>, id: K): V {
  const value = index.get(id);
  if (value === undefined) {
    throw new Error(`Reference "${String(id)}" was not resolved`);
  }
  return value;
}

/**
 * Resuelve las referencias de las solicitudes (categoría, flujo y resolución)
 * minimizando las llamadas a la fuente de datos.
 */
export class RequestComposer {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly workflows: WorkflowRepository,
    private readonly resolutions: ResolutionRepository,
  ) {}

  async compose(requests: readonly OperationalRequest[]): Promise<ComposedRequest[]> {
    const [categories, workflows] = await Promise.all([
      this.fetchCategories(requests),
      this.fetchWorkflows(requests),
    ]);

    return requests.map((request) => ({
      request,
      category: lookup(categories, request.categoryId),
      workflow: lookup(workflows, request.workflowId),
    }));
  }

  async composeWithResolution(
    requests: readonly OperationalRequest[],
  ): Promise<ComposedRequestWithResolution[]> {
    const [categories, workflows, resolutions] = await Promise.all([
      this.fetchCategories(requests),
      this.fetchWorkflows(requests),
      this.fetchResolutions(requests),
    ]);

    return requests.map((request) => ({
      request,
      category: lookup(categories, request.categoryId),
      workflow: lookup(workflows, request.workflowId),
      resolution: lookup(resolutions, request.resolutionId),
    }));
  }

  private fetchCategories(requests: readonly OperationalRequest[]): Promise<Map<string, Category>> {
    return fetchUnique(
      requests.map((request) => request.categoryId),
      (id) => this.categories.findById(id),
    );
  }

  private fetchWorkflows(requests: readonly OperationalRequest[]): Promise<Map<number, Workflow>> {
    return fetchUnique(
      requests.map((request) => request.workflowId),
      (id) => this.workflows.findById(id),
    );
  }

  private fetchResolutions(
    requests: readonly OperationalRequest[],
  ): Promise<Map<number, Resolution>> {
    return fetchUnique(
      requests.map((request) => request.resolutionId),
      (id) => this.resolutions.findById(id),
    );
  }
}
