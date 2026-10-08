import { z } from 'zod';
import { PRIORITIES, RESOLUTION_STATUSES, WORKFLOW_STATUSES } from '../requests/types';

const countsBy = <T extends readonly [string, ...string[]]>(keys: T) =>
  z.record(z.enum(keys), z.number().int());

export const metricsSchema = z.object({
  total: z.number().int(),
  openWorkflows: z.number().int(),
  pendingInformation: z.number().int(),
  highPriorityUnresolved: z.number().int(),
  approvalRate: z.number().nullable(),
  byWorkflowStatus: countsBy(WORKFLOW_STATUSES),
  byResolutionStatus: countsBy(RESOLUTION_STATUSES),
  byPriority: countsBy(PRIORITIES),
  byCategory: z.array(
    z.object({
      categoryId: z.string(),
      description: z.string(),
      count: z.number().int(),
    }),
  ),
  byMonth: z.array(z.object({ month: z.string(), count: z.number().int() })),
});

export type RequestMetrics = z.infer<typeof metricsSchema>;

/** Fila de una distribución lista para graficar. */
export interface DistributionRow {
  key: string;
  label: string;
  value: number;
}
