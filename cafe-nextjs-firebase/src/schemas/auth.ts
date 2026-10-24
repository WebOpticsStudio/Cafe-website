import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.').max(254),
  password: z.string().min(1, 'Enter your password.').max(128),
});

/** Body of `POST /api/auth/session`. */
export const sessionRequestSchema = z.object({
  idToken: z.string().min(20).max(8192),
});

export type LoginInput = z.infer<typeof loginSchema>;
