'use client';

import Link from 'next/link';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { signin } from '@/lib/auth';

export function SignInForm() {
  const [state, action] = useFormState(signin, undefined);

  return (
    <form action={action}>
      <div className='flex flex-col gap-2 w-64'>
        {state?.message && (
          <p className='text-sm text-red-500'>{state.message}</p>
        )}

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            placeholder='john.doe@example.com'
            type='email'
          />
        </div>

        {state?.error?.email && (
          <p className='text-sm text-red-500'>{state.error.email}</p>
        )}

        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            placeholder='********'
            type='password'
          />
        </div>

        {state?.error?.password && (
          <p className='text-sm text-red-500'>{state.error.password}</p>
        )}

        <Link className='text-sm underline' href='#'>
          Forgot your password?
        </Link>

        <SubmitButton>Sign In</SubmitButton>

        <div className='flex justify-between text-sm'>
          <p>Don&apos;t have an account?</p>

          <Link className='text-sm underline' href='/auth/signup'>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
