import { DomainError } from './domain-error';

export class PageOutOfRangeError extends DomainError {
  readonly code = 'PAGE_OUT_OF_RANGE';

  constructor(
    readonly page: number,
    readonly totalPages: number,
  ) {
    super(`Page ${page} is out of range (total pages: ${totalPages})`);
  }
}
