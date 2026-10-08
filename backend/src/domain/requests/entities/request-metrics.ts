import type { ComposedRequestWithResolution } from './composed-request';
import { PRIORITIES, type Priority } from './priority';
import { isResolutionFinished, RESOLUTION_STATUSES, type ResolutionStatus } from './resolution';
import { isWorkflowOpen, WORKFLOW_STATUSES, type WorkflowStatus } from './workflow';

export interface CategoryCount {
  categoryId: string;
  description: string;
  count: number;
}

export interface MonthCount {
  /** Formato YYYY-MM, según la fecha local de creación. */
  month: string;
  count: number;
}

export interface RequestMetrics {
  total: number;
  /** Flujo sin decisión: en revisión o pendiente de información. */
  openWorkflows: number;
  /** Bloqueadas hasta que alguien aporte información. */
  pendingInformation: number;
  /** Prioridad alta cuya resolución no terminó (ni resuelta ni cancelada). */
  highPriorityUnresolved: number;
  /** Aprobadas / decididas (aprobadas + rechazadas). `null` si aún no hay decisiones. */
  approvalRate: number | null;
  byWorkflowStatus: Record<WorkflowStatus, number>;
  byResolutionStatus: Record<ResolutionStatus, number>;
  byPriority: Record<Priority, number>;
  /** Ordenado de mayor a menor volumen. */
  byCategory: CategoryCount[];
  /** Ordenado cronológicamente. */
  byMonth: MonthCount[];
}

function zeroCounts<K extends string>(keys: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;
}

export function computeRequestMetrics(
  items: readonly ComposedRequestWithResolution[],
): RequestMetrics {
  const byWorkflowStatus = zeroCounts(WORKFLOW_STATUSES);
  const byResolutionStatus = zeroCounts(RESOLUTION_STATUSES);
  const byPriority = zeroCounts(PRIORITIES);
  const byCategory = new Map<string, CategoryCount>();
  const byMonth = new Map<string, number>();
  let openWorkflows = 0;
  let highPriorityUnresolved = 0;

  for (const { request, category, workflow, resolution } of items) {
    byWorkflowStatus[workflow.status] += 1;
    byResolutionStatus[resolution.status] += 1;
    byPriority[request.priority] += 1;

    const categoryCount = byCategory.get(category.id);
    if (categoryCount) {
      categoryCount.count += 1;
    } else {
      byCategory.set(category.id, {
        categoryId: category.id,
        description: category.description,
        count: 1,
      });
    }

    const month = request.createdAt.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + 1);

    if (isWorkflowOpen(workflow.status)) {
      openWorkflows += 1;
    }
    if (request.priority === 'high' && !isResolutionFinished(resolution.status)) {
      highPriorityUnresolved += 1;
    }
  }

  const decided = byWorkflowStatus.approved + byWorkflowStatus.rejected;

  return {
    total: items.length,
    openWorkflows,
    pendingInformation: byWorkflowStatus.pending_information,
    highPriorityUnresolved,
    approvalRate: decided === 0 ? null : byWorkflowStatus.approved / decided,
    byWorkflowStatus,
    byResolutionStatus,
    byPriority,
    byCategory: [...byCategory.values()].sort(
      (a, b) => b.count - a.count || a.description.localeCompare(b.description),
    ),
    byMonth: [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count })),
  };
}
