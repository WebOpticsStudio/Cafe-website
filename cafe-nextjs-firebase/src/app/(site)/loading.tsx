import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-14 w-3/4 max-w-xl" />
      <Skeleton className="mt-6 h-5 w-full max-w-md" />
      <Skeleton className="mt-10 h-64 w-full" />
    </Container>
  );
}
