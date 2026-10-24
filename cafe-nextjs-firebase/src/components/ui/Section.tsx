import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Container } from './Container';

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Landmark section with an h2; `aria-labelledby` ties the heading to the region. */
export function Section({ id, title, description, children, className }: SectionProps) {
  const headingId = `${id ?? title.toLowerCase().replace(/\W+/g, '-')}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn('py-16 sm:py-24', className)}>
      <Container>
        <div className="max-w-2xl">
          <h2 id={headingId} className="font-editorial text-3xl font-bold tracking-tight text-[#1C1510] sm:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-3 text-base sm:text-lg text-[#6B5E52] leading-relaxed">{description}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}

/** Page-level h1 block used by inner pages. */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b border-[#E5DDD1] bg-[#F4EFE6] py-14 sm:py-20">
      <Container>
        <h1 className="font-editorial text-4xl font-bold tracking-tight text-[#1C1510] sm:text-6xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#6B5E52] leading-relaxed">{description}</p> : null}
      </Container>
    </header>
  );
}
