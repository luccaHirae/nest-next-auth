'use server';

import { BACKEND_URL } from '@/constants';
import { getSession } from '@/lib/session';

export const getProfile = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/auth/profile`, {
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return await response.json();
};
