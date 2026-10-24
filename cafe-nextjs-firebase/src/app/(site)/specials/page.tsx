import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/Section';
import { SpecialsSection } from '@/features/home/components/SpecialsSection';
import { getMenu } from '@/features/menu/server/menu.service';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Specials | Brewista Coffee & Eatery',
  description: 'Handcrafted seasonal and signature food & beverage specials at Brewista.',
  alternates: { canonical: '/specials' },
};

export default async function SpecialsPage() {
  const menu = await getMenu();

  return (
    <>
      <PageHeader
        title="Chef & Barista Specials"
        description="Handcrafted seasonal creations, small-batch roasts, and artisan pastries made fresh in Bengaluru every morning."
      />
      <div className="pb-16">
        <SpecialsSection items={menu.featured} />
      </div>
    </>
  );
}
