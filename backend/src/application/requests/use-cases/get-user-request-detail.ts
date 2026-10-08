import { NotFoundError } from '../../../domain/shared/errors/not-found-error';
import { toRequestDetailDto, type RequestDetailDto } from '../dtos/request-dtos';
import type { RequestRepository } from '../ports/request-repository';
import type { RequestComposer } from '../services/request-composer';

export class GetUserRequestDetail {
  constructor(
    private readonly requests: RequestRepository,
    private readonly composer: RequestComposer,
  ) {}

  async execute(userId: number, requestId: number): Promise<RequestDetailDto> {
    const all = await this.requests.findAllByUser(userId);
    const request = all.find(({ id }) => id === requestId);
    if (!request) {
      throw new NotFoundError('Request', requestId);
    }

    const [composed] = await this.composer.composeWithResolution([request]);
    if (!composed) {
      throw new NotFoundError('Request', requestId);
    }
    return toRequestDetailDto(composed);
  }
}
