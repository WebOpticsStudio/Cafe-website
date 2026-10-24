'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Star, Calendar, ArrowRight } from 'lucide-react';

const ReservationModal = dynamic(
  () => import('@/features/reservation/components/ReservationModal').then((m) => m.ReservationModal),
  { ssr: false }
);

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  stars: number;
  avatar: string;
}

export function TestimonialsSection() {
  const [reservationOpen, setReservationOpen] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 'test-1',
      name: 'Rohan Mehta',
      quote: '"Best coffee in town! The ambiance is so cozy and the food is always fresh and delicious."',
      stars: 5,
      avatar: '/images/avatar-rohan.jpg',
    },
    {
      id: 'test-2',
      name: 'Simran Kaur',
      quote: '"A perfect place to work, catch up with friends or just enjoy a peaceful cup of coffee."',
      stars: 5,
      avatar: '/images/avatar-simran.jpg',
    },
    {
      id: 'test-3',
      name: 'Ankit Sharma',
      quote: '"Amazing atmosphere, friendly staff and the best cold brew I\'ve had in a long time!"',
      stars: 5,
      avatar: '/images/avatar-ankit.jpg',
    },
  ];

  return (
    <>
      <section className="py-12 sm:py-16 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header & Testimonial Cards Layout matching reference image */}
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Left Column: Heading */}
            <div className="lg:col-span-4">
              <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#C47935] uppercase">
                WHAT OUR CUSTOMERS SAY
              </p>
              <h2 className="mt-1.5 font-editorial text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-[#1C1510] leading-[1.1]">
                Great Food. <br />
                Happier People.
              </h2>
            </div>

            {/* Right Column: 3 Testimonial Cards (No Arrow Buttons) */}
            <div className="lg:col-span-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#E5DDD1] bg-white p-5 shadow-2xs hover:shadow-md transition-all"
                >
                  <p className="text-xs sm:text-[13px] text-[#2C241E] leading-relaxed">
                    {item.quote}
                  </p>

                  <div className="mt-5 border-t border-[#F4EFE6] pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-7 shrink-0 overflow-hidden rounded-full border border-[#E5DDD1] bg-[#F4EFE6]">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xs font-bold text-[#1C1510] leading-none">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Callout Banner (Matching reference design) ── */}
          <div className="mt-12 rounded-2xl bg-[#1C1510] p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wide">
                Good Coffee Awaits You
              </h3>
              <p className="mt-1 text-xs text-[#DDD0BC]">
                Visit us in Brooklyn for an unforgettable artisan coffee and culinary experience.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setReservationOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:bg-[#C47935] hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <Calendar className="size-3.5 text-[#C47935]" />
                <span>Reserve a Table</span>
                <ArrowRight className="size-3" />
              </button>

              <span className="hidden md:inline font-editorial italic text-xs text-[#C47935]">
                Same Good Vibes Always ♡
              </span>
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
