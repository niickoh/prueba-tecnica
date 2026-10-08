import type { UserRepository } from '../../application/users/ports/user-repository';
import type { Restriction } from '../../domain/users/entities/restriction';
import type { User } from '../../domain/users/entities/user';
import type { OperationsServiceClient } from '../services/operations-service-client';
import { callService } from './service-errors';
import { parseServiceResponse, rawRestrictionsSchema, rawUserSchema } from './service-schemas';

export class ServiceUserRepository implements UserRepository {
  constructor(private readonly service: OperationsServiceClient) {}

  async getCurrent(): Promise<User> {
    const data = await callService(() => this.service.getUser(), {
      resource: 'User',
      id: 'current',
    });
    const raw = parseServiceResponse(rawUserSchema, data, 'getUser');
    return {
      id: raw.user_id,
      name: raw.name,
      surname: raw.surname,
      area: raw.area,
      profileImage: raw.profile_image,
    };
  }

  async findRestrictions(userId: number): Promise<Restriction[]> {
    const data = await callService(() => this.service.getUserRestrictions(userId), {
      resource: 'User',
      id: userId,
    });
    return parseServiceResponse(rawRestrictionsSchema, data, 'getUserRestrictions');
  }
}
