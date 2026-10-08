import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    surname: z.string(),
    fullName: z.string(),
    area: z.string(),
    profileImage: z.string(),
  })
  .meta({ id: 'User' });

export const RestrictionSchema = z
  .object({
    type: z.string().meta({ example: 'warning' }),
    message: z.string(),
  })
  .meta({ id: 'Restriction' });

export const RestrictionListSchema = z.array(RestrictionSchema);
