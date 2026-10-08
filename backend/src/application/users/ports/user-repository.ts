import type { Restriction } from '../../../domain/users/entities/restriction';
import type { User } from '../../../domain/users/entities/user';

export interface UserRepository {
  getCurrent(): Promise<User>;
  /** Lanza `NotFoundError` si el usuario no existe. */
  findRestrictions(userId: number): Promise<Restriction[]>;
}
