import type { CategoryRepository } from '../../application/requests/ports/category-repository';
import type { Category } from '../../domain/requests/entities/category';
import type { OperationsServiceClient } from '../services/operations-service-client';
import { callService } from './service-errors';
import { parseServiceResponse, rawCategorySchema } from './service-schemas';

export class ServiceCategoryRepository implements CategoryRepository {
  constructor(private readonly service: OperationsServiceClient) {}

  async findById(categoryId: string): Promise<Category> {
    const data = await callService(() => this.service.getCategory(categoryId), {
      resource: 'Category',
      id: categoryId,
    });
    const raw = parseServiceResponse(rawCategorySchema, data, 'getCategory');
    return { id: raw.category_id, description: raw.description };
  }
}
