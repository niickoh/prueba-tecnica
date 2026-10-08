import { DomainError } from './domain-error';

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';

  constructor(
    readonly resource: string,
    readonly resourceId: string | number,
  ) {
    super(`${resource} "${resourceId}" was not found`);
  }
}
