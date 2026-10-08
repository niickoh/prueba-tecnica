import { describe, expect, it } from 'vitest';
import { CachedOperationsService } from '../../src/infrastructure/services/cached-operations-service';
import { FakeService } from '../helpers/fake-service';

describe('CachedOperationsService', () => {
  it('shares one in-flight call between concurrent identical requests', async () => {
    const inner = new FakeService();
    const cached = new CachedOperationsService(inner, 60_000);

    await Promise.all([cached.getCategory('DATA'), cached.getCategory('DATA')]);

    expect(inner.count('getCategory')).toBe(1);
  });

  it('calls the service again once the TTL expires', async () => {
    let now = 0;
    const inner = new FakeService();
    const cached = new CachedOperationsService(inner, 1_000, () => now);

    await cached.getWorkflow(1000010191);
    now = 999;
    await cached.getWorkflow(1000010191);
    now = 1_000;
    await cached.getWorkflow(1000010191);

    expect(inner.count('getWorkflow')).toBe(2);
  });

  it('does not cache failures', async () => {
    const inner = new FakeService();
    const cached = new CachedOperationsService(inner, 60_000);

    await expect(cached.getCategory('NOPE')).rejects.toMatchObject({ status: 404 });
    await expect(cached.getCategory('NOPE')).rejects.toMatchObject({ status: 404 });

    expect(inner.count('getCategory')).toBe(2);
  });
});
