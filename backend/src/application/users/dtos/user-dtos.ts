import type { Restriction } from '../../../domain/users/entities/restriction';
import type { User } from '../../../domain/users/entities/user';

export interface UserDto {
  id: number;
  name: string;
  surname: string;
  fullName: string;
  area: string;
  profileImage: string;
}

export interface RestrictionDto {
  type: string;
  message: string;
}

export function toUserDto(user: User): UserDto {
  return { ...user, fullName: `${user.name} ${user.surname}` };
}

export const toRestrictionDto = ({ type, message }: Restriction): RestrictionDto => ({
  type,
  message,
});
