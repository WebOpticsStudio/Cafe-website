'use client';

import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseClientConfigured } from '@/lib/env';
import { loginSchema } from '@/schemas/auth';

const inputClass =
  'border-line bg-surface mt-1 block min-h-12 w-full rounded-lg border px-4 text-base';

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email or password is incorrect.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a few minutes and try again.';
      case 'auth/network-request-failed':
        return 'Network problem. Check your connection and try again.';
    }
  }
  return 'Could not sign in. Please try again.';
}

/**
 * Email/password sign-in with the Firebase client SDK. The resulting ID token is exchanged
 * for an HTTP-only session cookie by `/api/auth/session`; the client-side auth state is then
 * discarded, so the cookie is the single source of truth.
 */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isFirebaseClientConfigured) {
    return (
      <p role="alert" className="rounded-lg border border-danger p-4 text-danger">
        Sign-in is unavailable because Firebase is not configured. See the README (&ldquo;Firebase
        setup&rdquo;).
      </p>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get('email'),
      password: form.get('password'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your details and try again.');
      return;
    }

    setPending(true);
    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(
        auth,
        parsed.data.email,
        parsed.data.password,
      );
      const idToken = await credential.user.getIdToken();

      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      await signOut(auth);

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? 'Could not sign in. Please try again.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch (caught) {
      setError(friendlyError(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-describedby={error ? 'login-error' : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={error ? 'login-error' : undefined}
          className={inputClass}
        />
      </div>

      {error ? (
        <p id="login-error" role="alert" className="font-medium text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
