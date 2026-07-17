import { z, ZodError } from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MESSAGE = '3–30 characters, letters, numbers, and underscores only';

export const loginSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, 'Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, USERNAME_MESSAGE)
    .max(30, USERNAME_MESSAGE)
    .regex(USERNAME_REGEX, USERNAME_MESSAGE),
  email: z.string().trim().regex(EMAIL_REGEX, 'Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

/** Collects the first issue per field into a flat { field: message } map. */
export function fieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
