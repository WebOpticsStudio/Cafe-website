'use client';

import Image from 'next/image';
import { Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';

interface GalleryPost {
  id: string;
  imageSrc: string;
  alt: string;
  caption: string;
  likes: number;
  comments: number;
}

export function GallerySection() {
  const posts: GalleryPost[] = [
    {
      id: 'post-1',
      imageSrc: '/images/gallery-1-barista.jpg',
      alt: 'Artisanal rosetta latte art poured by our master barista',
      caption: 'Every morning begins with precision and patience ☕✨',
      likes: 342,
      comments: 28,
    },
    {
      id: 'post-2',
      imageSrc: '/images/gallery-2-neon.jpg',
      alt: 'Cozy cafe interior with warm neon sign Coffee is always a good idea',
      caption: 'Our favorite corner for slow afternoons and great conversations 🌿',
      likes: 519,
      comments: 42,
    },
    {
      id: 'post-3',
      imageSrc: '/images/gallery-3-iced-latte.jpg',
      alt: 'Layered iced latte with fresh milk and espresso over clear ice',
      caption: 'Iced perfection for golden hour 🧊',
      likes: 284,
      comments: 19,
    },
    {
      id: 'post-4',
      imageSrc: '/images/gallery-4-counter.jpg',
      alt: 'Warm coffee bar counter with vintage Edison bulbs and espresso machine',
      caption: 'The heart of our neighborhood house. Meet our team behind the bar.',
      likes: 412,
      comments: 31,
    },
    {
      id: 'post-5',
      imageSrc: '/images/gallery-5-cheesecake.jpg',
      alt: 'Slice of New York style berry cheesecake topped with raspberries and blueberries',
      caption: 'Fresh out of the bakery kitchen: summer berry cheesecake slice 🍓',
      likes: 638,
      comments: 54,
    },
    {
      id: 'post-6',
      imageSrc: '/images/gallery-6-cup.jpg',
      alt: 'Overhead view of matte black coffee cup with swan latte art and roasted coffee beans',
      caption: 'Ethically sourced, locally roasted, masterfully poured 🦢',
      likes: 476,
      comments: 37,
    },
  ];

  const handle = siteConfig.instagram.handle ?? 'brewista.cafe';

  return (
    <section id="gallery" className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#E5DDD1] pb-3">
          <div className="flex items-center gap-2">
            <InstagramIcon width={16} height={16} className="text-[#C47935]" />
            <h3 className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1C1510]">
              Follow Us <span className="text-[#C47935]">@{handle}</span>
            </h3>
          </div>

          <a
            href={`https://www.instagram.com/${handle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:text-[#C47935] transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 6-Photo Responsive Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`https://www.instagram.com/${handle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5DDD1] bg-[#F4EFE6] shadow-2xs"
            >
              <Image
                src={post.imageSrc}
                alt={post.alt}
                fill
                sizes="(min-width: 1280px) 190px, (min-width: 1024px) 160px, (min-width: 640px) 180px, 30vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#120D0A]/70 p-2 text-center text-white opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3 fill-[#C47935] text-[#C47935]" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
