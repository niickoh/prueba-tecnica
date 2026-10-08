import { z } from 'zod';
import { PRIORITIES } from '../../../domain/requests/entities/priority';
import { RESOLUTION_STATUSES } from '../../../domain/requests/entities/resolution';
import { WORKFLOW_STATUSES } from '../../../domain/requests/entities/workflow';
import { MAX_PAGE_SIZE } from '../../../domain/shared/entities/pagination';
import { PaginationSchema, positiveIntParam, UserIdParamsSchema } from './common-schemas';

export const PrioritySchema = z.enum(PRIORITIES).meta({ id: 'Priority' });
export const WorkflowStatusSchema = z.enum(WORKFLOW_STATUSES).meta({ id: 'WorkflowStatus' });
export const ResolutionStatusSchema = z.enum(RESOLUTION_STATUSES).meta({ id: 'ResolutionStatus' });

export const ListRequestsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).meta({ description: 'Página (desde 1)' }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(10)
    .meta({ description: `Elementos por página (máx. ${MAX_PAGE_SIZE})` }),
  status: WorkflowStatusSchema.optional().meta({ description: 'Estado del flujo' }),
  priority: PrioritySchema.optional(),
  category: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .optional()
    .meta({ description: 'Id de categoría', example: 'ACCESS' }),
});

export const CategoryIdParamsSchema = z.object({
  categoryId: z.string().trim().min(1).max(64).meta({ description: 'Id de la categoría' }),
});
export const WorkflowIdParamsSchema = z.object({ workflowId: positiveIntParam('Id del flujo') });
export const ResolutionIdParamsSchema = z.object({
  resolutionId: positiveIntParam('Id de la resolución'),
});
export const RequestDetailParamsSchema = UserIdParamsSchema.extend({
  requestId: positiveIntParam('Id de la solicitud'),
});

export const CategorySchema = z
  .object({ id: z.string(), description: z.string() })
  .meta({ id: 'Category' });
export const WorkflowSchema = z
  .object({ id: z.number().int(), status: WorkflowStatusSchema })
  .meta({ id: 'Workflow' });
export const ResolutionSchema = z
  .object({ id: z.number().int(), status: ResolutionStatusSchema })
  .meta({ id: 'Resolution' });

export const RequestSummarySchema = z
  .object({
    id: z.number().int(),
    subject: z.string(),
    priority: PrioritySchema,
    createdAt: z.string().meta({ description: 'ISO 8601 con offset original' }),
    requester: z.object({ id: z.number().int(), name: z.string(), area: z.string() }),
    category: CategorySchema,
    workflow: WorkflowSchema,
  })
  .meta({ id: 'RequestSummary' });

export const RequestDetailSchema = RequestSummarySchema.extend({
  resolution: ResolutionSchema,
}).meta({ id: 'RequestDetail' });

export const PaginatedRequestsSchema = z
  .object({ data: z.array(RequestSummarySchema), pagination: PaginationSchema })
  .meta({ id: 'PaginatedRequests' });

const countsBy = <T extends readonly [string, ...string[]]>(keys: T) =>
  z.object(
    Object.fromEntries(keys.map((key) => [key, z.number().int()])) as {
      [K in T[number]]: z.ZodNumber;
    },
  );

export const RequestMetricsSchema = z
  .object({
    total: z.number().int(),
    openWorkflows: z
      .number()
      .int()
      .meta({ description: 'Flujo sin decisión (en revisión o pendiente de información)' }),
    pendingInformation: z.number().int(),
    highPriorityUnresolved: z
      .number()
      .int()
      .meta({ description: 'Prioridad alta con resolución no terminada' }),
    approvalRate: z
      .number()
      .nullable()
      .meta({ description: 'Aprobadas / (aprobadas + rechazadas); null sin decisiones' }),
    byWorkflowStatus: countsBy(WORKFLOW_STATUSES),
    byResolutionStatus: countsBy(RESOLUTION_STATUSES),
    byPriority: countsBy(PRIORITIES),
    byCategory: z.array(
      z.object({ categoryId: z.string(), description: z.string(), count: z.number().int() }),
    ),
    byMonth: z.array(
      z.object({ month: z.string().meta({ example: '2022-07' }), count: z.number().int() }),
    ),
  })
  .meta({ id: 'RequestMetrics' });

export const RequestFilterOptionsSchema = z
  .object({
    workflowStatuses: z.array(WorkflowStatusSchema),
    priorities: z.array(PrioritySchema),
    categories: z.array(CategorySchema),
  })
  .meta({ id: 'RequestFilterOptions' });
