import { z } from 'zod';

export const EmptySchema = z.object({});

export const positiveIntParam = (description: string) =>
  z.coerce.number().int().positive().max(Number.MAX_SAFE_INTEGER).meta({ description });

export const UserIdParamsSchema = z.object({ userId: positiveIntParam('Id del usuario') });

export const ErrorResponseSchema = z
  .object({
    error: z.object({
      code: z.string().meta({ example: 'NOT_FOUND' }),
      message: z.string(),
      details: z
        .array(
          z.object({
            location: z.enum(['params', 'query']),
            path: z.string(),
            message: z.string(),
          }),
        )
        .optional(),
    }),
  })
  .meta({ id: 'ErrorResponse' });

export const PaginationSchema = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int().meta({ description: 'Total de elementos tras aplicar los filtros' }),
    totalPages: z.number().int(),
  })
  .meta({ id: 'Pagination' });
