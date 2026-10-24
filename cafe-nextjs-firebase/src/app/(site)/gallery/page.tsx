import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/Section';
import { Coffee, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gallery | Brewista Coffee & Eatery',
  description: 'Explore our cozy atmosphere, artisanal brews, handcrafted food, and master baristas in action.',
  alternates: { canonical: '/gallery' },
};

const galleryImages = [
  {
    id: 'g-1',
    src: '/images/cafe-interior-real.jpg',
    title: 'Warm & Inviting Main Dining Space',
    category: 'Ambience',
    description: 'Natural oak tables, warm lighting, and lush greenery.',
  },
  {
    id: 'g-2',
    src: '/images/gallery-6-cup.jpg',
    title: 'Artisan Pour Rosetta Latte',
    category: 'Coffee',
    description: 'Handcrafted with whole oat milk and freshly pulled espresso.',
  },
  {
    id: 'g-3',
    src: '/images/gallery-2-neon.jpg',
    title: 'Cozy Reading Nook & Signage',
    category: 'Ambience',
    description: 'Good coffee, better days — our favorite quiet spot.',
  },
  {
    id: 'g-4',
    src: '/images/gallery-4-counter.jpg',
    title: 'Espresso Bar & Pastry Display',
    category: 'Barista Bar',
    description: 'Sleek custom timber counter with warm recessed illumination.',
  },
  {
    id: 'g-5',
    src: '/images/gallery-5-cheesecake.jpg',
    title: 'Fresh Wild Berry Cheesecake',
    category: 'Daily Bakes',
    description: 'Baked in-house daily with organic vanilla and fresh berries.',
  },
  {
    id: 'g-6',
    src: '/images/gallery-1-barista.jpg',
    title: 'Precision Extraction & Free Pour',
    category: 'The Craft',
    description: 'Our head barista crafting competition-grade specialty espresso.',
  },
  {
    id: 'g-7',
    src: '/images/cappuccino.jpg',
    title: 'Classic Brewista Cappuccino',
    category: 'Coffee',
    description: 'Rich crema, velvet foam, and freshly roasted espresso.',
  },
  {
    id: 'g-8',
    src: '/images/avocado-toast.jpg',
    title: 'Signature Sourdough Avocado Toast',
    category: 'Food',
    description: 'Hass avocado, chilli flakes, microgreens, and organic pumpkin seeds.',
  },
  {
    id: 'g-9',
    src: '/images/berry-pancakes.jpg',
    title: 'Fluffy Stack Berry Pancakes',
    category: 'Food',
    description: 'Topped with Canadian maple syrup and seasonal handpicked berries.',
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Our Space & Stories"
        description="A visual journey through our Brooklyn sanctuary — where passion for specialty coffee meets thoughtful, comforting food."
      />

      <Container className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DDD1] bg-white shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F4EFE6]">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-[#1C1510]/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {img.category}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-editorial text-base font-bold text-[#1C1510] group-hover:text-[#C47935] transition-colors">
                    {img.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#6B5E52] leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-3xl bg-[#1C1510] p-8 sm:p-10 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-editorial italic text-xs text-[#C47935] uppercase tracking-wider font-semibold">
              Visit Us Today
            </span>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Experience the Ambiance in Person
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#DDD0BC] max-w-xl">
              123 Coffee Street, Brooklyn, NY. Drop in for morning espresso or book a table for weekend brunch.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/menu"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-all"
            >
              Explore Menu
            </Link>
            <Link
              href="/visit"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C47935] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#B36828] transition-all"
            >
              <span>Visit Us</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
