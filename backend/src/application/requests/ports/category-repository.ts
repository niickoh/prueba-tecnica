import type { Category } from '../../../domain/requests/entities/category';

export interface CategoryRepository {
  /** Lanza `NotFoundError` si la categoría no existe. */
  findById(categoryId: string): Promise<Category>;
}
