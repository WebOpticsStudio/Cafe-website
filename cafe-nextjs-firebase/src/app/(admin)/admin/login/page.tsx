import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { getSessionUser } from '@/features/auth/server/session';

export const metadata: Metadata = { title: 'Sign in' };
// Reads the session cookie per request – must never be prerendered at build time.
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user?.isAdmin) redirect('/admin');

  return (
    <Container className="max-w-md py-20">
      <h1 className="text-4xl font-bold">Staff sign-in</h1>
      <p className="mt-3 text-muted">Sign in to update what is available on the menu.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </Container>
  );
}
