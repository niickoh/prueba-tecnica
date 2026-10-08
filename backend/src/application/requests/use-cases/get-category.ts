import { toCategoryDto, type CategoryDto } from '../dtos/request-dtos';
import type { CategoryRepository } from '../ports/category-repository';

export class GetCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(categoryId: string): Promise<CategoryDto> {
    return toCategoryDto(await this.categories.findById(categoryId));
  }
}
