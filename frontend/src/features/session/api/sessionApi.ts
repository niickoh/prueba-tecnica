import { z } from 'zod';
import { apiGet } from '../../../lib/http';
import { restrictionSchema, userSchema } from '../types';

export const fetchCurrentUser = (signal?: AbortSignal) =>
  apiGet('/users/me', userSchema, { signal });

export const fetchRestrictions = (userId: number, signal?: AbortSignal) =>
  apiGet(`/users/${userId}/restrictions`, z.array(restrictionSchema), {
    signal,
  });
