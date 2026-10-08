import { DomainError } from './domain-error';

export class InvalidPaginationError extends DomainError {
  readonly code = 'INVALID_PAGINATION';
}
