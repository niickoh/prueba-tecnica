import type { Resolution } from '../../../domain/requests/entities/resolution';

export interface ResolutionRepository {
  /** Lanza `NotFoundError` si la resolución no existe. */
  findById(resolutionId: number): Promise<Resolution>;
}
