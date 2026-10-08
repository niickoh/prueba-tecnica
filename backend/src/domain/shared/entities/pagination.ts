import { InvalidPaginationError } from '../errors/invalid-pagination-error';
import { PageOutOfRangeError } from '../errors/page-out-of-range-error';

export const MAX_PAGE_SIZE = 100;

export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Value object de paginación por número de página.
 * Un resultado vacío admite la página 1 (para poder mostrar "lista vacía");
 * cualquier otra página fuera de rango es un error, igual que en `Service`.
 */
export class Pagination {
  private constructor(
    readonly page: number,
    readonly limit: number,
  ) {}

  static create(page: number, limit: number): Pagination {
    if (!Number.isInteger(page) || page < 1) {
      throw new InvalidPaginationError('page must be an integer greater than or equal to 1');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
      throw new InvalidPaginationError(`limit must be an integer between 1 and ${MAX_PAGE_SIZE}`);
    }
    return new Pagination(page, limit);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  apply<T>(items: readonly T[]): Page<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / this.limit);

    if (this.page > Math.max(totalPages, 1)) {
      throw new PageOutOfRangeError(this.page, totalPages);
    }

    return {
      items: items.slice(this.offset, this.offset + this.limit),
      page: this.page,
      limit: this.limit,
      total,
      totalPages,
    };
  }
}
