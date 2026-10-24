import 'server-only';
import { z } from 'zod';

/**
 * SERVER-ONLY environment variables (secrets).
 *
 * `import 'server-only'` makes the build fail if a Client Component ever imports this
 * module, so these values cannot leak into the browser bundle.
 *
 * Read lazily (not at import time) so that `next build` works without secrets.
 */
const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const serverEnvSchema = z.object({
  FIREBASE_CLIENT_EMAIL: z.preprocess(emptyToUndefined, z.email().optional()),
  // `.env` files cannot hold real newlines; the key is stored with literal "\n" sequences.
  FIREBASE_PRIVATE_KEY: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .optional()
      .transform((key) => key?.replace(/\\n/g, '\n')),
  ),
  INSTAGRAM_ACCESS_TOKEN: z.preprocess(emptyToUndefined, z.string().min(10).optional()),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (!cached) {
    const result = serverEnvSchema.safeParse({
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    });
    if (!result.success) {
      // Zod's pretty error lists field names and reasons, never the offending values.
      throw new Error(`Invalid server environment variables:\n${z.prettifyError(result.error)}`);
    }
    cached = result.data;
  }
  return cached;
}
