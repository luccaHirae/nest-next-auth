'use server';

import { BACKEND_URL } from '@/constants';
import { authFetch } from '@/lib/auth-fetch';

export const getProfile = async () => {
  const response = await authFetch(`${BACKEND_URL}/profile`);
  return await response.json();
};
