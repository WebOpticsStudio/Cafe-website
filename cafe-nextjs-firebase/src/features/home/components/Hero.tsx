'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Coffee,
  Armchair,
  Wifi,
  ShoppingBag,
  Calendar,
} from 'lucide-react';

const ReservationModal = dynamic(
  () => import('@/features/reservation/components/ReservationModal').then((m) => m.ReservationModal),
  { ssr: false }
);

export function Hero() {
  const [reservationOpen, setReservationOpen] = useState(false);

  // Exactly the 3 requested highlight items ("Delicious Food Options" removed per user request)
  const highlights = [
    {
      icon: Coffee,
      title: 'FRESHLY BREWED COFFEE',
      description: 'Made with premium quality beans',
    },
    {
      icon: Armchair,
      title: 'COZY AMBIENT SPACE',
      description: 'Perfect place to relax, work or meet',
    },
    {
      icon: Wifi,
      title: 'FREE WIFI AVAILABLE',
      description: 'Stay connected while you sip & relax',
    },
  ];

  return (
    <>
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative w-full overflow-hidden bg-[#FAF7F2] min-h-[calc(100vh-96px)] min-h-[calc(100dvh-96px)] flex flex-col justify-between"
      >
        {/* ── Background Banner Photography (Crystal-clear 1920x900 artisanal coffee) ── */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/images/hero-clean-artisan.jpg"
            alt="Artisanal specialty coffee on a rustic wooden cafe table"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-center"
          />

          {/* Mobile soft wash to guarantee flawless text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] from-45% via-[#FAF7F2]/90 to-transparent md:hidden" />
        </div>

        {/* ── Hero Content Container (Fills viewport cleanly so only home section is visible on landing) ── */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-10 flex-1 flex flex-col justify-between py-6 sm:py-8 lg:py-10">
          {/* Main Editorial Text & Actions with proper vertical alignment */}
          <div className="my-auto max-w-xl">
            {/* Cursive Subtitle */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-editorial italic text-[#C47935] font-semibold mb-2 sm:mb-2.5">
              <span className="tracking-wide">Good Coffee, Good Vibes</span>
              <span className="text-sm">☕</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1
              id="hero-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-[3.25rem] font-bold tracking-tight text-[#1C1510] leading-[1.08]"
            >
              Start Your Day <br />
              the <span className="font-normal italic text-[#C47935]">Right</span> Way
            </h1>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-3.5 text-xs sm:text-sm text-[#6B5E52] max-w-md leading-relaxed font-sans">
              We serve freshly brewed coffee, delicious food, and good vibes – every single day.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3.5">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1C1510] px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#C47935] transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="size-3.5 text-[#C47935]" />
                <span>Explore Menu</span>
              </Link>

              <button
                type="button"
                onClick={() => setReservationOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#1C1510]/30 bg-white/95 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:bg-white transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="size-3.5 text-[#C47935]" />
                <span>Book a Table</span>
              </button>
            </div>
          </div>

          {/* 
            ── 3 Highlights Strip (Delicious food options removed, clean 3-col layout along bottom) ── 
          */}
          <div className="w-full max-w-2xl xl:max-w-3xl rounded-2xl bg-white/95 backdrop-blur-xs py-3.5 px-5 sm:px-6 shadow-xs border border-[#E5DDD1]/80 mt-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`flex items-start gap-2.5 ${
                      idx !== 0 ? 'sm:border-l sm:border-[#E5DDD1]/70 sm:pl-3.5' : ''
                    }`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#C47935] border border-[#E5DDD1]/50 mt-0.5">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[10px] font-bold tracking-wider text-[#1C1510] uppercase leading-tight">
                        {item.title}
                      </h2>
                      <p className="mt-0.5 text-[10px] text-[#6B5E52] leading-tight line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  );
}
