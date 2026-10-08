import { ApiError } from './http';

/** Mensaje para el usuario según el tipo de error (sin exponer detalles técnicos). */
export function describeError(error: Error): string {
  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error inesperado.';
  }
  switch (error.status) {
    case 0:
      return 'No se pudo conectar con el servidor. Revisá tu conexión.';
    case 400:
      return 'La consulta no es válida.';
    case 404:
      return 'No encontramos lo que buscabas.';
    case 502:
      return 'La fuente de datos no está disponible en este momento.';
    default:
      return 'Ocurrió un error inesperado.';
  }
}
