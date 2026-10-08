import type { ErrorRequestHandler, RequestHandler } from 'express';
import { UpstreamServiceError } from '../../../application/shared/errors/upstream-service-error';
import { DomainError } from '../../../domain/shared/errors/domain-error';
import { InvalidPaginationError } from '../../../domain/shared/errors/invalid-pagination-error';
import { NotFoundError } from '../../../domain/shared/errors/not-found-error';
import { PageOutOfRangeError } from '../../../domain/shared/errors/page-out-of-range-error';
import { RequestValidationError } from '../errors/request-validation-error';

export interface Logger {
  error(message: string, error: unknown): void;
}

function domainErrorStatus(error: DomainError): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof InvalidPaginationError || error instanceof PageOutOfRangeError) return 400;
  return 422;
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
};

/** Traduce errores a respuestas `{ error: { code, message, details? } }` sin filtrar internos. */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _req, res, _next) => {
    if (error instanceof RequestValidationError) {
      res
        .status(400)
        .json({ error: { code: error.code, message: error.message, details: error.issues } });
      return;
    }
    if (error instanceof DomainError) {
      res
        .status(domainErrorStatus(error))
        .json({ error: { code: error.code, message: error.message } });
      return;
    }
    if (error instanceof UpstreamServiceError) {
      logger.error(error.message, error.cause);
      res
        .status(502)
        .json({ error: { code: error.code, message: 'The data source is unavailable' } });
      return;
    }

    logger.error('Unhandled error', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } });
  };
}
