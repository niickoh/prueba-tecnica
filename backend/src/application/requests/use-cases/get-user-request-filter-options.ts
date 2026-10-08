import { PRIORITIES } from '../../../domain/requests/entities/priority';
import { WORKFLOW_STATUSES } from '../../../domain/requests/entities/workflow';
import { toCategoryDto, type RequestFilterOptionsDto } from '../dtos/request-dtos';
import type { CategoryRepository } from '../ports/category-repository';
import type { RequestRepository } from '../ports/request-repository';

/**
 * Opciones para los filtros del listado. `Service` no expone un catálogo de
 * categorías, así que se derivan de las solicitudes del usuario.
 */
export class GetUserRequestFilterOptions {
  constructor(
    private readonly requests: RequestRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async execute(userId: number): Promise<RequestFilterOptionsDto> {
    const all = await this.requests.findAllByUser(userId);
    const categoryIds = [...new Set(all.map(({ categoryId }) => categoryId))];
    const categories = await Promise.all(categoryIds.map((id) => this.categories.findById(id)));

    return {
      workflowStatuses: [...WORKFLOW_STATUSES],
      priorities: [...PRIORITIES],
      categories: categories
        .map(toCategoryDto)
        .sort((a, b) => a.description.localeCompare(b.description)),
    };
  }
}
