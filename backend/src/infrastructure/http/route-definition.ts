import type { Request } from 'express';
import type { z } from 'zod';
import { RequestValidationError } from './errors/request-validation-error';
import { EmptySchema } from './schemas/common-schemas';

type ObjectSchema = z.ZodObject;

interface RouteMeta {
  method: 'get';
  /** Ruta en formato OpenAPI (`/users/{userId}`), relativa al prefijo `/api`. */
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  /** Códigos de error documentados además del 200. */
  errorStatuses: (400 | 404 | 502)[];
}

interface RouteConfig<
  P extends ObjectSchema,
  Q extends ObjectSchema,
  R extends z.ZodType,
> extends RouteMeta {
  params: P;
  query: Q;
  response: R;
  /** El tipo de retorno obliga a que el DTO cumpla el esquema documentado. */
  handler: (input: { params: z.output<P>; query: z.output<Q> }) => Promise<z.input<R>>;
}

/** Ruta con tipos borrados, lista para montar en Express y documentar en OpenAPI. */
export interface ApiRoute extends RouteMeta {
  params: ObjectSchema;
  query: ObjectSchema;
  response: z.ZodType;
  handle(req: Request): Promise<unknown>;
}

function validate<S extends ObjectSchema>(
  schema: S,
  value: unknown,
  location: 'params' | 'query',
): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw RequestValidationError.fromZod(location, result.error);
  }
  return result.data;
}

export function defineRoute<
  R extends z.ZodType,
  P extends ObjectSchema = typeof EmptySchema,
  Q extends ObjectSchema = typeof EmptySchema,
>(config: Omit<RouteConfig<P, Q, R>, 'params' | 'query'> & { params?: P; query?: Q }): ApiRoute {
  const params = (config.params ?? EmptySchema) as P;
  const query = (config.query ?? EmptySchema) as Q;
  const { handler, ...meta } = config;

  return {
    ...meta,
    params,
    query,
    handle: (req) =>
      handler({
        params: validate(params, req.params, 'params'),
        query: validate(query, req.query, 'query'),
      }),
  };
}

export const toExpressPath = (openApiPath: string) => openApiPath.replace(/{(\w+)}/g, ':$1');
