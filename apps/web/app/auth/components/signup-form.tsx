'use client';

import { useFormState } from 'react-dom';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signup } from '@/lib/auth';

export function SignUpForm() {
  const [state, action] = useFormState(signup, undefined);

  return (
    <form action={action}>
      <div className='flex flex-col gap-2'>
        {state?.message && <p className='text-red-500'>{state.message}</p>}

        <div>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' placeholder='John Doe' />
        </div>

        {state?.error?.name && (
          <p className='text-red-500'>{state.error.name}</p>
        )}

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' placeholder='john.doe@example.com' />
        </div>

        {state?.error?.email && (
          <p className='text-red-500'>{state.error.email}</p>
        )}

        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='********'
          />
        </div>

        {state?.error?.password && (
          <div className='text-sm text-red-500'>
            <p>Password must:</p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <SubmitButton className='mt-2'>Sign Up</SubmitButton>
      </div>
    </form>
  );
}
