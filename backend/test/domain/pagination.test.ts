import { describe, expect, it } from 'vitest';
import { Pagination } from '../../src/domain/shared/entities/pagination';
import { InvalidPaginationError } from '../../src/domain/shared/errors/invalid-pagination-error';
import { PageOutOfRangeError } from '../../src/domain/shared/errors/page-out-of-range-error';

const items = Array.from({ length: 25 }, (_, index) => index);

describe('Pagination', () => {
  it('returns the requested slice with totals', () => {
    const page = Pagination.create(3, 10).apply(items);

    expect(page).toEqual({
      items: [20, 21, 22, 23, 24],
      page: 3,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it('allows page 1 of an empty result so the client can render an empty state', () => {
    expect(Pagination.create(1, 10).apply([])).toEqual({
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it('rejects pages beyond the last one', () => {
    expect(() => Pagination.create(4, 10).apply(items)).toThrow(PageOutOfRangeError);
    expect(() => Pagination.create(2, 10).apply([])).toThrow(PageOutOfRangeError);
  });

  it.each([
    [0, 10],
    [1.5, 10],
    [1, 0],
    [1, 101],
  ])('rejects invalid parameters page=%s limit=%s', (page, limit) => {
    expect(() => Pagination.create(page, limit)).toThrow(InvalidPaginationError);
  });
});
