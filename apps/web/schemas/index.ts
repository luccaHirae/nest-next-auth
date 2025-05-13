import { FORM_VALIDATION } from '@/constants';
import { z } from 'zod';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(FORM_VALIDATION.NAME_LENGTH, {
      message: 'Name must be at least 2 characters long.',
    })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim(),
  password: z
    .string()
    .min(FORM_VALIDATION.PASSWORD_LENGTH, {
      message: `'Password must be at least ${FORM_VALIDATION.PASSWORD_LENGTH} characters long.' `,
    })
    .regex(/[a-zA-Z]/, {
      message: 'Password must contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[@$!%*?&]/, {
      message: 'Password must contain at least one special character.',
    })
    .trim(),
});
