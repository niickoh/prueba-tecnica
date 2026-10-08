import { describe, expect, it } from 'vitest';
import { createUseCases } from '../../src/composition';
import { PageOutOfRangeError } from '../../src/domain/shared/errors/page-out-of-range-error';
import { FakeService, largeDataset } from '../helpers/fake-service';

function setup(service = new FakeService()) {
  return { service, listUserRequests: createUseCases(service).listUserRequests };
}

describe('ListUserRequests', () => {
  it('applies filters on the full set before paginating', async () => {
    const { listUserRequests } = setup();

    const result = await listUserRequests.execute({
      userId: 1,
      page: 1,
      limit: 2,
      filters: { workflowStatus: 'approved' },
    });

    // 5 aprobadas en todo el conjunto, no sólo en la primera página de Service.
    expect(result.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
    expect(result.data.map((request) => request.id)).toEqual([300198, 300196]);
    expect(result.data.every((request) => request.workflow.status === 'approved')).toBe(true);
  });

  it('combines status, priority and category filters', async () => {
    const { listUserRequests } = setup();

    const result = await listUserRequests.execute({
      userId: 1,
      page: 1,
      limit: 10,
      filters: { workflowStatus: 'approved', priority: 'high', categoryId: 'FINANCE' },
    });

    expect(result.data.map((request) => request.id)).toEqual([300198]);
  });

  it('returns an empty first page when nothing matches', async () => {
    const { listUserRequests } = setup();

    const result = await listUserRequests.execute({
      userId: 1,
      page: 1,
      limit: 10,
      filters: { categoryId: 'UNKNOWN' },
    });

    expect(result).toEqual({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  });

  it('rejects a page out of range of the filtered result', async () => {
    const { listUserRequests } = setup();

    await expect(
      listUserRequests.execute({ userId: 1, page: 2, limit: 10, filters: { priority: 'low' } }),
    ).rejects.toBeInstanceOf(PageOutOfRangeError);
  });

  it('only resolves references for the requested page when there is no status filter', async () => {
    const { service, listUserRequests } = setup();

    await listUserRequests.execute({ userId: 1, page: 1, limit: 3, filters: {} });

    expect(service.count('getWorkflow')).toBe(3);
    expect(service.count('getCategory')).toBe(3); // ACCESS, DATA, FINANCE: una vez cada una
    expect(service.count('getResolution')).toBe(0);
  });

  it('reads every Service batch when the user has more than 100 requests', async () => {
    const { service, listUserRequests } = setup(new FakeService(largeDataset(250)));

    const result = await listUserRequests.execute({
      userId: 1,
      page: 13,
      limit: 20,
      filters: {},
    });

    expect(service.count('getUserRequests')).toBe(3);
    expect(result.pagination).toEqual({ page: 13, limit: 20, total: 250, totalPages: 13 });
    expect(result.data).toHaveLength(10);
  });
});
