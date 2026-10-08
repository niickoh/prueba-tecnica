import { z } from 'zod';
import { PRIORITIES } from '../../domain/requests/entities/priority';
import { RESOLUTION_STATUSES } from '../../domain/requests/entities/resolution';
import { WORKFLOW_STATUSES } from '../../domain/requests/entities/workflow';
import { UpstreamServiceError } from '../../application/shared/errors/upstream-service-error';

/** Formato crudo (snake_case) que devuelve `Service`. */
export const rawUserSchema = z.object({
  user_id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  area: z.string(),
  profile_image: z.string(),
});

export const rawRestrictionsSchema = z.array(z.object({ type: z.string(), message: z.string() }));

export const rawRequestSchema = z.object({
  request_id: z.number().int(),
  subject: z.string(),
  priority: z.enum(PRIORITIES),
  category_id: z.string(),
  created_at: z.iso.datetime({ offset: true }),
  requester: z.object({ id: z.number().int(), name: z.string(), area: z.string() }),
  workflow_id: z.number().int(),
  resolution_id: z.number().int(),
});

export const rawRequestPageSchema = z.object({
  total: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  data: z.array(rawRequestSchema),
});

export const rawCategorySchema = z.object({ category_id: z.string(), description: z.string() });

export const rawWorkflowSchema = z.object({
  workflow_id: z.number().int(),
  status: z.enum(WORKFLOW_STATUSES),
});

export const rawResolutionSchema = z.object({
  resolution_id: z.number().int(),
  status: z.enum(RESOLUTION_STATUSES),
});

export function parseServiceResponse<T>(schema: z.ZodType<T>, data: unknown, source: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new UpstreamServiceError(`Unexpected response from ${source}`, { cause: result.error });
  }
  return result.data;
}
