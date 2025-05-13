import Link from 'next/link';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignInForm() {
  return (
    <form action=''>
      <div className='flex flex-col gap-2 w-64'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          placeholder='john.doe@example.com'
          type='email'
        />
      </div>

      <div className='flex flex-col gap-2 w-64'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          placeholder='********'
          type='password'
        />
      </div>

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
    </form>
  );
}
