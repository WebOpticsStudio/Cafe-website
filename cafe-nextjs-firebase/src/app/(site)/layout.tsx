import type { ReactNode } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { SiteShell } from '@/components/layout/SiteShell';
import { getOpeningHours } from '@/features/hours/server/hours.service';
import { buildCafeJsonLd } from '@/lib/seo/json-ld';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const hours = await getOpeningHours();
  return (
    <SiteShell>
      <JsonLd data={buildCafeJsonLd(hours)} />
      {children}
    </SiteShell>
  );
}
