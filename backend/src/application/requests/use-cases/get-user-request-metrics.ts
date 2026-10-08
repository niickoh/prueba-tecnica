import { computeRequestMetrics } from '../../../domain/requests/entities/request-metrics';
import type { RequestMetricsDto } from '../dtos/request-dtos';
import type { RequestRepository } from '../ports/request-repository';
import type { RequestComposer } from '../services/request-composer';

export class GetUserRequestMetrics {
  constructor(
    private readonly requests: RequestRepository,
    private readonly composer: RequestComposer,
  ) {}

  async execute(userId: number): Promise<RequestMetricsDto> {
    const all = await this.requests.findAllByUser(userId);
    const composed = await this.composer.composeWithResolution(all);
    return computeRequestMetrics(composed);
  }
}
