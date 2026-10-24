import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/Section';
import { Coffee, Award, Leaf, Flame, Heart, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Brewista Coffee & Eatery',
  description: 'Learn about our passion for freshly roasted coffee, honest food, and creating a warm neighborhood sanctuary in Marathahalli, Bengaluru.',
  alternates: { canonical: '/about' },
};

const pillars = [
  {
    icon: Award,
    title: 'Quality Ingredients',
    description: 'We source single-origin specialty beans rated 85+ and partner with local organic dairies for the richest, creamiest texture.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    description: 'Direct trade relationships with smallholder farms around the world, paying fair premiums above commodity prices.',
  },
  {
    icon: Flame,
    title: 'Locally Roasted',
    description: 'Roasted right here in small, micro-batches each week to preserve the vibrant terroir and subtle aromatic notes.',
  },
  {
    icon: Heart,
    title: 'Made with Passion',
    description: 'Every shot is dialed in daily by our dedicated baristas, accompanied by handcrafted recipes prepared fresh every morning.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="More Than Just a Café"
        description="We believe great coffee has the power to bring people together, inspire creative thought, and turn everyday moments into memories."
      />

      <Container className="py-12 space-y-16">
        {/* Story Section with Real Interior Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="relative min-h-[380px] lg:col-span-6 rounded-3xl overflow-hidden border border-[#E5DDD1] shadow-sm">
            <Image
              src="/images/cafe-interior-real.jpg"
              alt="Brewista modern interior with warm timber counter and cozy seating"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="font-editorial italic text-xs text-[#C47935] uppercase tracking-wider font-semibold">
              Our Journey
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1510] leading-tight">
              Crafting Good Coffee & <br />
              <span className="text-[#C47935] italic font-normal">Warmer Days</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
              Brewista was born out of a desire for a different kind of coffeehouse: one that celebrates culinary craftsmanship without pretension, and where every guest is welcomed like family.
            </p>
            <p className="text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
              From our custom-designed espresso bar to our sunlit communal tables and handpicked reading selection, every corner of our Bengaluru space has been thoughtfully designed for comfort and creative inspiration.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#C47935] transition-all"
              >
                <span>View Our Menu</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/visit"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DDD1] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:border-[#C47935] hover:text-[#C47935] transition-all"
              >
                <span>Find Us in Bengaluru</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="border-t border-[#E5DDD1] pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-editorial italic text-xs text-[#C47935] uppercase tracking-wider font-semibold">
              Our Values
            </span>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-[#1C1510]">
              What We Stand For
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B5E52]">
              From farm to cup, our commitment to transparency, quality, and hospitality guides everything we brew and serve.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E5DDD1] bg-white p-6 shadow-2xs hover:shadow-md hover:border-[#C47935]/40 transition-all"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#C47935] border border-[#E5DDD1] mb-4">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#1C1510]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6B5E52] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </>
  );
}
