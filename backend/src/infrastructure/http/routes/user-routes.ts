import type { GetCurrentUser } from '../../../application/users/use-cases/get-current-user';
import type { GetUserRestrictions } from '../../../application/users/use-cases/get-user-restrictions';
import { defineRoute, type ApiRoute } from '../route-definition';
import { UserIdParamsSchema } from '../schemas/common-schemas';
import { RestrictionListSchema, UserSchema } from '../schemas/user-schemas';

interface UserRouteDeps {
  getCurrentUser: GetCurrentUser;
  getUserRestrictions: GetUserRestrictions;
}

export function userRoutes({ getCurrentUser, getUserRestrictions }: UserRouteDeps): ApiRoute[] {
  return [
    defineRoute({
      method: 'get',
      path: '/users/me',
      summary: 'Usuario actual (operador)',
      tags: ['Users'],
      errorStatuses: [502],
      response: UserSchema,
      handler: () => getCurrentUser.execute(),
    }),
    defineRoute({
      method: 'get',
      path: '/users/{userId}/restrictions',
      summary: 'Restricciones y avisos de la cuenta del usuario',
      tags: ['Users'],
      errorStatuses: [400, 404, 502],
      params: UserIdParamsSchema,
      response: RestrictionListSchema,
      handler: ({ params }) => getUserRestrictions.execute(params.userId),
    }),
  ];
}
