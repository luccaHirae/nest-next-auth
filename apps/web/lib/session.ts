'use server';

import { jwtVerify, SignJWT } from 'jose';
import { Session } from '@/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(SECRET_KEY);

/**
 * Creates a new session and sets it as an HTTP-only cookie.
 *
 * @param payload - The session payload containing the data to be included in the session token.
 *
 * The function generates a JSON Web Token (JWT) with the provided payload,
 * using the HS256 algorithm for signing. The token is set to expire in 7 days.
 *
 * The session token is then stored in a cookie with the following properties:
 * - `httpOnly`: Ensures the cookie is not accessible via JavaScript.
 * - `secure`: Ensures the cookie is only sent over HTTPS.
 * - `expires`: Sets the expiration date of the cookie to 7 days from the current date.
 * - `sameSite`: Restricts the cookie to be sent with same-site requests or top-level navigation.
 * - `path`: Specifies the root path (`/`) for which the cookie is valid.
 *
 * @throws Will throw an error if the JWT signing process fails.
 */
export async function createSession(payload: Session) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload as Session;
  } catch (err) {
    console.error('Error verifying session:', err);
    redirect('/auth/signin');
  }
}

export async function deleteSession() {
  (await cookies()).delete('session');
}
