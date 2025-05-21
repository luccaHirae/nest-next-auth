import { createSession } from '@/lib/session';
import { Role } from '@/types';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const role = searchParams.get('role');

  if (!accessToken || !refreshToken || !userId || !name || !role) {
    throw new Error('Missing required parameters');
  }

  await createSession({
    user: {
      id: Number(userId),
      name,
      role: role as Role,
    },
    accessToken,
    refreshToken,
  });

  redirect('/');
}
