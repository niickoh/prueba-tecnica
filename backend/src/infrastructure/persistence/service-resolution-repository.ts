import type { ResolutionRepository } from '../../application/requests/ports/resolution-repository';
import type { Resolution } from '../../domain/requests/entities/resolution';
import type { OperationsServiceClient } from '../services/operations-service-client';
import { callService } from './service-errors';
import { parseServiceResponse, rawResolutionSchema } from './service-schemas';

export class ServiceResolutionRepository implements ResolutionRepository {
  constructor(private readonly service: OperationsServiceClient) {}

  async findById(resolutionId: number): Promise<Resolution> {
    const data = await callService(() => this.service.getResolution(resolutionId), {
      resource: 'Resolution',
      id: resolutionId,
    });
    const raw = parseServiceResponse(rawResolutionSchema, data, 'getResolution');
    return { id: raw.resolution_id, status: raw.status };
  }
}
