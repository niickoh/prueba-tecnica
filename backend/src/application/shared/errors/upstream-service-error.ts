/** La fuente de datos falló o devolvió datos con un formato inesperado. */
export class UpstreamServiceError extends Error {
  readonly code = 'UPSTREAM_SERVICE_ERROR';

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'UpstreamServiceError';
  }
}
