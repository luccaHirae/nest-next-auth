import { updateTokens } from '@/lib/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken) {
    return new Response('Missing access token or refresh token', {
      status: 400,
    });
  }

  await updateTokens({ accessToken, refreshToken });

  return new Response('Tokens updated successfully', {
    status: 200,
  });
}
