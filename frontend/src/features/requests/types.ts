import { z } from 'zod';

export const WORKFLOW_STATUSES = [
  'in_review',
  'pending_information',
  'approved',
  'rejected',
] as const;
export const PRIORITIES = ['high', 'medium', 'low'] as const;
export const RESOLUTION_STATUSES = ['pending', 'in_progress', 'resolved', 'cancelled'] as const;

export const workflowStatusSchema = z.enum(WORKFLOW_STATUSES);
export const prioritySchema = z.enum(PRIORITIES);
export const resolutionStatusSchema = z.enum(RESOLUTION_STATUSES);

export const categorySchema = z.object({
  id: z.string(),
  description: z.string(),
});

export const requestSummarySchema = z.object({
  id: z.number().int(),
  subject: z.string(),
  priority: prioritySchema,
  createdAt: z.string(),
  requester: z.object({
    id: z.number().int(),
    name: z.string(),
    area: z.string(),
  }),
  category: categorySchema,
  workflow: z.object({ id: z.number().int(), status: workflowStatusSchema }),
});

export const requestDetailSchema = requestSummarySchema.extend({
  resolution: z.object({
    id: z.number().int(),
    status: resolutionStatusSchema,
  }),
});

export const paginatedRequestsSchema = z.object({
  data: z.array(requestSummarySchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export const filterOptionsSchema = z.object({
  workflowStatuses: z.array(workflowStatusSchema),
  priorities: z.array(prioritySchema),
  categories: z.array(categorySchema),
});

export type WorkflowStatus = z.infer<typeof workflowStatusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type ResolutionStatus = z.infer<typeof resolutionStatusSchema>;
export type Category = z.infer<typeof categorySchema>;
export type RequestSummary = z.infer<typeof requestSummarySchema>;
export type RequestDetail = z.infer<typeof requestDetailSchema>;
export type PaginatedRequests = z.infer<typeof paginatedRequestsSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;

/** Filtros aplicados al listado (`undefined` = sin filtrar). */
export interface RequestFilters {
  status?: WorkflowStatus;
  priority?: Priority;
  category?: string;
}
