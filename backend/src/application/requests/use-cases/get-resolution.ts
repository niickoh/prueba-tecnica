import { toResolutionDto, type ResolutionDto } from '../dtos/request-dtos';
import type { ResolutionRepository } from '../ports/resolution-repository';

export class GetResolution {
  constructor(private readonly resolutions: ResolutionRepository) {}

  async execute(resolutionId: number): Promise<ResolutionDto> {
    return toResolutionDto(await this.resolutions.findById(resolutionId));
  }
}
