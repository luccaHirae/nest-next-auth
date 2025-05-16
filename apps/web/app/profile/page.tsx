import { getProfile } from '@/lib/actions';

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>Profile</h1>
      <p className='mt-4 text-lg'>Welcome to your profile!</p>
      <p className='mt-2 text-sm text-gray-500'>This is a placeholder page.</p>
      <p>{JSON.stringify(profile, null, 2)}</p>
    </div>
  );
}
