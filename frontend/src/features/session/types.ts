import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  area: z.string(),
  profileImage: z.string(),
});

export const restrictionSchema = z.object({
  type: z.string(),
  message: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Restriction = z.infer<typeof restrictionSchema>;
