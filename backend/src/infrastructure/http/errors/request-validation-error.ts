import type { z } from 'zod';

export interface ValidationIssue {
  location: 'params' | 'query';
  path: string;
  message: string;
}

/** Parámetros de entrada HTTP inválidos (path o query). */
export class RequestValidationError extends Error {
  readonly code = 'VALIDATION_ERROR';

  constructor(readonly issues: ValidationIssue[]) {
    super('Request validation failed');
    this.name = 'RequestValidationError';
  }

  static fromZod(location: ValidationIssue['location'], error: z.ZodError): RequestValidationError {
    return new RequestValidationError(
      error.issues.map((issue) => ({
        location,
        path: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }
}
