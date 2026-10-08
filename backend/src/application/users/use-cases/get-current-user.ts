import { toUserDto, type UserDto } from '../dtos/user-dtos';
import type { UserRepository } from '../ports/user-repository';

export class GetCurrentUser {
  constructor(private readonly users: UserRepository) {}

  async execute(): Promise<UserDto> {
    return toUserDto(await this.users.getCurrent());
  }
}
