import { SignInForm } from '@/app/auth/components/signin-form';
import { BACKEND_URL } from '@/constants';

export default function SignInPage() {
  return (
    <div className='bg-white text-zinc-800 p-8 rounded-lg w-96 flex flex-col justify-center items-center'>
      <h1 className='text-center text-2xl font-bold mb-4'>Sign In</h1>

      <SignInForm />

      <hr />

      <a href={`${BACKEND_URL}/auth/google/login`}>Sign In With Google</a>

      <div className='flex flex-col gap-2'></div>
    </div>
  );
}
