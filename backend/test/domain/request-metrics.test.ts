import { describe, expect, it } from 'vitest';
import type { ComposedRequestWithResolution } from '../../src/domain/requests/entities/composed-request';
import type { Priority } from '../../src/domain/requests/entities/priority';
import { computeRequestMetrics } from '../../src/domain/requests/entities/request-metrics';
import type { ResolutionStatus } from '../../src/domain/requests/entities/resolution';
import type { WorkflowStatus } from '../../src/domain/requests/entities/workflow';

function item(
  id: number,
  priority: Priority,
  categoryId: string,
  workflowStatus: WorkflowStatus,
  resolutionStatus: ResolutionStatus,
  createdAt: string,
): ComposedRequestWithResolution {
  return {
    request: {
      id,
      subject: `Request ${id}`,
      priority,
      categoryId,
      createdAt,
      requester: { id: 1, name: 'Ana', area: 'Ops' },
      workflowId: id,
      resolutionId: id,
    },
    category: { id: categoryId, description: `Category ${categoryId}` },
    workflow: { id, status: workflowStatus },
    resolution: { id, status: resolutionStatus },
  };
}

describe('computeRequestMetrics', () => {
  it('derives volume and distribution metrics', () => {
    const metrics = computeRequestMetrics([
      item(1, 'high', 'A', 'in_review', 'in_progress', '2022-07-01T00:30:00.000-03:00'),
      item(2, 'high', 'A', 'approved', 'resolved', '2022-07-15T10:00:00.000-03:00'),
      item(3, 'low', 'B', 'rejected', 'cancelled', '2022-06-30T23:30:00.000-03:00'),
      item(4, 'medium', 'A', 'pending_information', 'pending', '2022-05-01T10:00:00.000-03:00'),
      item(5, 'high', 'B', 'approved', 'pending', '2022-07-20T10:00:00.000-03:00'),
    ]);

    expect(metrics).toEqual({
      total: 5,
      openWorkflows: 2,
      pendingInformation: 1,
      highPriorityUnresolved: 2,
      approvalRate: 2 / 3,
      byWorkflowStatus: { in_review: 1, pending_information: 1, approved: 2, rejected: 1 },
      byResolutionStatus: { pending: 2, in_progress: 1, resolved: 1, cancelled: 1 },
      byPriority: { high: 3, medium: 1, low: 1 },
      byCategory: [
        { categoryId: 'A', description: 'Category A', count: 3 },
        { categoryId: 'B', description: 'Category B', count: 2 },
      ],
      // El mes usa la fecha local del solicitante, no UTC (la #3 sería julio en UTC).
      byMonth: [
        { month: '2022-05', count: 1 },
        { month: '2022-06', count: 1 },
        { month: '2022-07', count: 3 },
      ],
    });
  });

  it('returns zeroed counters and a null approval rate without data', () => {
    const metrics = computeRequestMetrics([]);

    expect(metrics.total).toBe(0);
    expect(metrics.approvalRate).toBeNull();
    expect(metrics.byPriority).toEqual({ high: 0, medium: 0, low: 0 });
    expect(metrics.byCategory).toEqual([]);
  });
});
