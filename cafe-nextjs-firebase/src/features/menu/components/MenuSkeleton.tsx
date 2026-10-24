import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export function MenuSkeleton() {
  return (
    <Container className="py-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading the menu…</span>
      <Skeleton className="h-10 w-48" />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ))}
      </div>
    </Container>
  );
}
