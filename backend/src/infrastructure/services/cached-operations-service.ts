import type { OperationsServiceClient } from './operations-service-client';
import { PromiseCache } from './promise-cache';

/** Decorador del `Service` que evita llamadas redundantes (cada una tarda 0,5–3 s). */
export class CachedOperationsService implements OperationsServiceClient {
  private readonly cache: PromiseCache;

  constructor(
    private readonly inner: OperationsServiceClient,
    ttlMs: number,
    now?: () => number,
  ) {
    this.cache = new PromiseCache(ttlMs, now);
  }

  getUser() {
    return this.cache.get('user', () => this.inner.getUser());
  }

  getUserRestrictions(userId: string | number) {
    return this.cache.get(`restrictions:${userId}`, () => this.inner.getUserRestrictions(userId));
  }

  getUserRequests(userId: string | number, limit?: number, page?: number) {
    return this.cache.get(`requests:${userId}:${limit}:${page}`, () =>
      this.inner.getUserRequests(userId, limit, page),
    );
  }

  getCategory(categoryId: string | number) {
    return this.cache.get(`category:${categoryId}`, () => this.inner.getCategory(categoryId));
  }

  getWorkflow(workflowId: string | number) {
    return this.cache.get(`workflow:${workflowId}`, () => this.inner.getWorkflow(workflowId));
  }

  getResolution(resolutionId: string | number) {
    return this.cache.get(`resolution:${resolutionId}`, () =>
      this.inner.getResolution(resolutionId),
    );
  }
}
