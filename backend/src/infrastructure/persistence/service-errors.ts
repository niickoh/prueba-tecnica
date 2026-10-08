import { UpstreamServiceError } from '../../application/shared/errors/upstream-service-error';
import { NotFoundError } from '../../domain/shared/errors/not-found-error';

interface ResourceRef {
  resource: string;
  id: string | number;
}

/** `Service` señala los errores con una propiedad `status` (400 o 404). */
export function serviceErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
}

export function translateServiceError(error: unknown, ref: ResourceRef): Error {
  if (error instanceof UpstreamServiceError) {
    return error;
  }
  if (serviceErrorStatus(error) === 404) {
    return new NotFoundError(ref.resource, ref.id);
  }
  return new UpstreamServiceError(`Service call failed for ${ref.resource} "${ref.id}"`, {
    cause: error,
  });
}

/** Ejecuta una llamada a `Service` traduciendo sus errores a errores de dominio/aplicación. */
export async function callService<T>(call: () => Promise<T>, ref: ResourceRef): Promise<T> {
  try {
    return await call();
  } catch (error) {
    throw translateServiceError(error, ref);
  }
}
