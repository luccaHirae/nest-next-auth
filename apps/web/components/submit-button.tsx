'use client';

import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SubmitButton({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      aria-disabled={pending}
      className={cn('w-full', className)}
    >
      {pending ? 'Submitting...' : children}
    </Button>
  );
}
