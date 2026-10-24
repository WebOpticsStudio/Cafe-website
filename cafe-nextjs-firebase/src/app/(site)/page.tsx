import { Hero } from '@/features/home/components/Hero';
import { SpecialsSection } from '@/features/home/components/SpecialsSection';
import { AboutStorySection } from '@/features/home/components/AboutStorySection';
import { CuratedGallery } from '@/features/home/components/CuratedGallery';
import { TestimonialsSection } from '@/features/home/components/TestimonialsSection';
import { getMenu } from '@/features/menu/server/menu.service';

// Incremental Static Regeneration: re-read Firestore at most every 5 minutes.
export const revalidate = 300;

export default async function HomePage() {
  const menu = await getMenu();

  return (
    <>
      {/* ── 1. Hero Section (Compact top spacing, full-width photo, 4-item highlights) ── */}
      <Hero />

      {/* ── 2. Specials Section (Handcrafted with love, Add to Cart functional controls) ── */}
      <SpecialsSection items={menu.featured} />

      {/* ── 3. About Us / Our Story (Authentic interior photo, hours, book table card & pillars) ── */}
      <AboutStorySection />

      {/* ── 4. Curated Gallery (Our Space: A Cozy Place to Belong - No Instagram account required) ── */}
      <CuratedGallery />

      {/* ── 5. Testimonial Section (Great Food. Happier People. + Good Coffee Awaits You Banner) ── */}
      <TestimonialsSection />
    </>
  );
}
