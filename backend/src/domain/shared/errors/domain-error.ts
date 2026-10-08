/** Base de los errores de negocio. La capa HTTP los traduce a códigos de estado. */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
