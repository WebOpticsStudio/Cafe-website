'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Clock,
  Calendar,
  Coffee,
  Leaf,
  Flame,
  Award,
  Heart,
  ArrowRight,
} from 'lucide-react';

const ReservationModal = dynamic(
  () => import('@/features/reservation/components/ReservationModal').then((m) => m.ReservationModal),
  { ssr: false }
);

export function AboutStorySection() {
  const [reservationOpen, setReservationOpen] = useState(false);

  const pillars = [
    {
      icon: Award,
      title: 'Quality Ingredients',
      description: 'Single-origin beans & organic milk',
    },
    {
      icon: Leaf,
      title: 'Sustainable Sourcing',
      description: 'Ethical trade & eco-friendly packaging',
    },
    {
      icon: Flame,
      title: 'Locally Roasted',
      description: 'Small micro-batches roasted weekly',
    },
    {
      icon: Heart,
      title: 'Made with Passion',
      description: 'Every cup handcrafted with love',
    },
  ];

  return (
    <>
      <section id="about" className="py-10 sm:py-14 bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── 3-Column Storytelling Grid ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            {/* 1. Left Card: Authentic Cafe Interior Photograph */}
            <div className="relative min-h-[300px] sm:min-h-[340px] lg:col-span-4 rounded-2xl overflow-hidden border border-[#E5DDD1] shadow-2xs">
              <Image
                src="/images/cafe-interior-real.jpg"
                alt="Brewista modern cafe interior with ambient wood counter and warm lighting"
                fill
                sizes="(min-width: 1024px) 380px, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Floating Quality Badge matching reference */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 rounded-xl border border-[#E5DDD1]/40 bg-[#FAF7F2]/95 backdrop-blur-xs px-3 py-2 shadow-md">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#1C1510] text-[#C47935]">
                  <Coffee className="size-3.5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-[#6B5E52]">
                    Certified
                  </p>
                  <p className="font-editorial text-xs font-bold text-[#1C1510] leading-none">
                    Premium Quality Beans
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Middle Card: Brand Philosophy Story */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DDD1] bg-[#FAF7F2] p-6 sm:p-7 lg:col-span-4 shadow-2xs">
              <div>
                <p className="font-editorial italic text-xs text-[#C47935] uppercase tracking-wider font-semibold">
                  Our Story
                </p>
                <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1510] leading-tight">
                  A Café for <br />
                  <span className="italic font-normal text-[#C47935]">Brighter Days</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
                  Brewista started with a simple idea — great coffee brings people together. We are here to serve exceptional brews, comforting food, warm conversations, and a space that feels like home.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5DDD1]/60">
                <Link
                  href="/visit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#C47935] transition-all"
                >
                  <span>Our Story</span>
                  <ArrowRight className="size-3 text-[#C47935]" />
                </Link>
              </div>
            </div>

            {/* 3. Right Card: Unified Dark Espresso Hours & Table Booking Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-[#1C1510] p-5 sm:p-6 lg:col-span-4 shadow-sm text-white">
              {/* Top Half: Opening Hours */}
              <div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="size-4 text-[#DDD0BC]" />
                  <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
                    Opening Hours
                  </h3>
                </div>

                <ul className="mt-4 space-y-2.5 text-xs text-[#DDD0BC]">
                  <li className="flex justify-between items-center">
                    <span>Monday – Friday</span>
                    <span className="font-semibold text-white">7:00 AM – 10:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Saturday</span>
                    <span className="font-semibold text-white">8:00 AM – 11:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Sunday</span>
                    <span className="font-semibold text-white">8:00 AM – 9:00 PM</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Half: Nested Caramel Table Booking Card */}
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#B97737] to-[#A26227] p-4 sm:p-5 relative overflow-hidden flex items-center justify-between gap-3 shadow-inner">
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-white">
                    <Calendar className="size-4" />
                    <h4 className="font-editorial text-base font-bold text-white tracking-wide">
                      Book Your Table
                    </h4>
                  </div>

                  <p className="mt-1.5 text-[11px] text-white/90 leading-tight max-w-[200px]">
                    Reserve your table and enjoy a special experience with us.
                  </p>

                  <button
                    type="button"
                    onClick={() => setReservationOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>RESERVE NOW</span>
                    <ArrowRight className="size-3 text-white" />
                  </button>
                </div>

                {/* Circular Coffee Cup Vignette */}
                <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
                  <Image
                    src="/images/cappuccino.jpg"
                    alt="Artisanal rosetta latte art"
                    fill
                    sizes="(min-width: 640px) 96px, 80px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Value Pillars Strip ── */}
          <div className="mt-8 pt-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#C47935] border border-[#E5DDD1]">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-[#1C1510] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#6B5E52] truncate">
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

      {/* Reservation Modal Trigger */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  );
}
