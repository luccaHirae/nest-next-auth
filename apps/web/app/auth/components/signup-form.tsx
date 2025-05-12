import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpForm() {
  return (
    <form>
      <div className='flex flex-col gap-2'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' placeholder='John Doe' />
        </div>

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' placeholder='john.doe@example.com' />
        </div>

        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='********'
          />
        </div>
      </div>
    </form>
  );
}
