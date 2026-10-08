import {
  matchesOwnFields,
  type RequestFilters,
} from '../../../domain/requests/entities/request-filters';
import { Pagination } from '../../../domain/shared/entities/pagination';
import {
  toPaginatedDto,
  toRequestSummaryDto,
  type PaginatedDto,
  type RequestSummaryDto,
} from '../dtos/request-dtos';
import type { RequestRepository } from '../ports/request-repository';
import type { RequestComposer } from '../services/request-composer';

export interface ListUserRequestsInput {
  userId: number;
  page: number;
  limit: number;
  filters: RequestFilters;
}

/**
 * Lista paginada de solicitudes. Los filtros se aplican sobre el conjunto
 * completo antes de paginar. Para no resolver referencias de más:
 * - prioridad y categoría se filtran con los datos crudos;
 * - sin filtro de estado, sólo se componen las solicitudes de la página pedida.
 */
export class ListUserRequests {
  constructor(
    private readonly requests: RequestRepository,
    private readonly composer: RequestComposer,
  ) {}

  async execute({
    userId,
    page,
    limit,
    filters,
  }: ListUserRequestsInput): Promise<PaginatedDto<RequestSummaryDto>> {
    const pagination = Pagination.create(page, limit);
    const all = await this.requests.findAllByUser(userId);
    const candidates = all.filter((request) => matchesOwnFields(request, filters));

    const { workflowStatus } = filters;
    if (workflowStatus === undefined) {
      const pageOfRequests = pagination.apply(candidates);
      const items = await this.composer.compose(pageOfRequests.items);
      return toPaginatedDto({ ...pageOfRequests, items }, toRequestSummaryDto);
    }

    const composed = await this.composer.compose(candidates);
    const matching = composed.filter(({ workflow }) => workflow.status === workflowStatus);
    return toPaginatedDto(pagination.apply(matching), toRequestSummaryDto);
  }
}
