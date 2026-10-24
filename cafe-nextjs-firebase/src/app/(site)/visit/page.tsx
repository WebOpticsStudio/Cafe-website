import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { getOpeningHours } from '@/features/hours/server/hours.service';
import { ContactSection } from '@/features/contact/components/ContactSection';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact Us & Visit | Brewista Coffee & Eatery',
  description: `Check opening hours or send an enquiry to ${siteConfig.name} in Marathahalli, Bengaluru.`,
  alternates: { canonical: '/visit' },
};

export default async function VisitPage() {
  const hours = await getOpeningHours();

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-4 sm:py-6">
      <Container className="max-w-6xl">
        {/* ── Compact Header ── */}
        <div className="text-center mx-auto max-w-xl mb-3 sm:mb-4">
          <p className="font-editorial italic text-[11px] text-[#C47935] uppercase tracking-widest font-semibold">
            — Visit & Connect —
          </p>
          <h1 className="mt-0.5 font-editorial text-2xl sm:text-3xl font-bold text-[#1C1510] tracking-tight">
            Contact <span className="italic font-normal text-[#C47935]">Us</span>
          </h1>
        </div>

        {/* ── Side-by-Side: Opening Hours & Enquiry Form (Fits in One Go Without Scrolling) ── */}
        <ContactSection hours={hours} />
      </Container>
    </div>
  );
}
