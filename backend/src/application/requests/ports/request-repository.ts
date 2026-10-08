import type { OperationalRequest } from '../../../domain/requests/entities/operational-request';

export interface RequestRepository {
  /** Todas las solicitudes del usuario. Lanza `NotFoundError` si el usuario no existe. */
  findAllByUser(userId: number): Promise<OperationalRequest[]>;
}
