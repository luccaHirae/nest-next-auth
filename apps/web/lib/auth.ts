'use server';

import { BACKEND_URL } from '@/constants';
import { SigninFormSchema, SignupFormSchema } from '@/schemas';
import { FormState, SigninResponse } from '@/types';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/session';

export async function signup(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    redirect('/auth/signin');
  } else {
    return {
      message:
        response.status === 409 ? 'Email already in use' : response.statusText,
    };
  }
}

export async function signin(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    const result = (await response.json()) as SigninResponse;

    await createSession({
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    redirect('/');
  } else {
    return {
      message:
        response.status === 401 ? 'Invalid credentials' : response.statusText,
    };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: oldRefreshToken,
      }),
    });

    if (!response.ok) throw new Error('Failed to refresh token');

    const { accessToken, refreshToken } = await response.json();

    const updateTokensResponse = await fetch('/api/auth/update', {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });

    if (!updateTokensResponse.ok) throw new Error('Failed to update tokens');

    return accessToken;
  } catch (err) {
    console.error('Error refreshing token:', err);
    return null;
  }
};
