import { toRestrictionDto, type RestrictionDto } from '../dtos/user-dtos';
import type { UserRepository } from '../ports/user-repository';

export class GetUserRestrictions {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: number): Promise<RestrictionDto[]> {
    const restrictions = await this.users.findRestrictions(userId);
    return restrictions.map(toRestrictionDto);
  }
}
