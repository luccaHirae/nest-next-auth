import Link from 'next/link';
import { SignUpForm } from '@/app/auth/components/signup-form';

export default function SignUpPage() {
  return (
    <div className='bg-white text-zinc-800 p-8 rounded-lg w-96 flex flex-col justify-center items-center'>
      <h1 className='text-center text-2xl font-bold mb-4'>Sign Up</h1>

      <SignUpForm />

      <div className='flex justify-between text-sm gap-1'>
        <p>Already have an account?</p>
        <Link className='underline' href='/auth/signin'>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
