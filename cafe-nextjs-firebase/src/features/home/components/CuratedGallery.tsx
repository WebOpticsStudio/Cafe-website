import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  imageSrc: string;
  alt: string;
  tag: string;
}

export function CuratedGallery() {
  const photos: GalleryItem[] = [
    {
      id: 'photo-1',
      imageSrc: '/images/cafe-interior-real.jpg',
      alt: 'Warm and inviting seating area with wooden tables',
      tag: 'Ambience',
    },
    {
      id: 'photo-2',
      imageSrc: '/images/gallery-6-cup.jpg',
      alt: 'Artisanal latte art coffee in ceramic mug with roasted beans',
      tag: 'Specialty Coffee',
    },
    {
      id: 'photo-3',
      imageSrc: '/images/gallery-2-neon.jpg',
      alt: 'Cozy brick wall with glowing warm neon signage and books',
      tag: 'Cozy Corners',
    },
    {
      id: 'photo-4',
      imageSrc: '/images/gallery-4-counter.jpg',
      alt: 'Craft espresso bar with vintage pendant lights',
      tag: 'Barista Bar',
    },
    {
      id: 'photo-5',
      imageSrc: '/images/gallery-5-cheesecake.jpg',
      alt: 'Fresh artisanal berry cheesecake slice',
      tag: 'Daily Bakes',
    },
    {
      id: 'photo-6',
      imageSrc: '/images/gallery-1-barista.jpg',
      alt: 'Master barista hand-pouring free-pour rosetta art',
      tag: 'The Craft',
    },
  ];

  return (
    <section id="gallery" className="py-10 sm:py-14 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
          <div>
            <p className="font-editorial italic text-xs text-[#C47935] uppercase tracking-wider font-semibold">
              Our Space
            </p>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1510]">
              A Cozy Place to Belong
            </h2>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:text-[#C47935] transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 6 Curated Photo Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3.5">
          {photos.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#E5DDD1] bg-[#F4EFE6] shadow-2xs hover:shadow-md transition-all"
            >
              <Image
                src={item.imageSrc}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 190px, (min-width: 1024px) 160px, (min-width: 640px) 220px, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />

              {/* Tag overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1510]/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAF7F2]">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
