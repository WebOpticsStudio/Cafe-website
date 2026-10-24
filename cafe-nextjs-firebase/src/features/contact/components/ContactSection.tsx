'use client';

import { useState } from 'react';
import { Clock, Mail, MapPin, Phone, Calendar, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { OpenStatusBadge } from '@/features/hours/components/OpenStatusBadge';
import { ContactForm } from './ContactForm';
import { ReservationModal } from '@/features/reservation/components/ReservationModal';
import type { OpeningHours } from '@/schemas/hours';

interface ContactSectionProps {
  hours: OpeningHours;
}

export function ContactSection({ hours }: ContactSectionProps) {
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <div className="w-full">
      {/* ── Equal Height & Equal Width Side-by-Side Grid (No Maps, Fits in One Go) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* ── 1. Left Card: Opening Hours & Location (Equal Width & Height) ── */}
        <div className="h-full flex flex-col justify-between rounded-2xl border border-[#E5DDD1] bg-white p-4 sm:p-5 lg:p-6 shadow-xs">
          <div>
            {/* Header with Live Status */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1]/70">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#C47935] shadow-2xs">
                  <Clock className="size-4" />
                </span>
                <div>
                  <h2 className="font-editorial text-base sm:text-lg font-bold text-[#1C1510] leading-none">
                    Opening Hours
                  </h2>
                  <p className="text-[10px] text-[#6B5E52] mt-0.5">Freshly brewed daily in Brooklyn</p>
                </div>
              </div>

              <OpenStatusBadge hours={hours} locale={siteConfig.locale} className="text-xs" />
            </div>

            {/* Consolidated Weekly Schedule (3 Clean Rows instead of 7) */}
            <div className="my-3 space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-[#FAF7F2] border border-[#E5DDD1]/50 font-medium text-[#1C1510]">
                <span>Monday – Friday</span>
                <span className="font-bold text-[#C47935] tabular-nums">7:00 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white border border-[#E5DDD1]/60 text-[#1C1510]">
                <span>Saturday</span>
                <span className="font-bold tabular-nums">8:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white border border-[#E5DDD1]/60 text-[#1C1510]">
                <span>Sunday</span>
                <span className="font-bold tabular-nums">8:00 AM – 9:00 PM</span>
              </div>
            </div>

            {/* Compact Direct Contact Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2.5 border-t border-[#E5DDD1]/70 text-[11px] text-[#6B5E52]">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="size-3.5 text-[#C47935] shrink-0" />
                <span className="truncate">123 Coffee St, Brooklyn</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="size-3.5 text-[#C47935] shrink-0" />
                <a href={`tel:${siteConfig.contact.phoneTel}`} className="hover:text-[#C47935] font-medium truncate">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="size-3.5 text-[#C47935] shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#C47935] font-medium truncate">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-3 border-t border-[#E5DDD1]/70 flex items-center justify-between gap-2 mt-2">
            <span className="text-[11px] text-[#6B5E52] flex items-center gap-1">
              <Sparkles className="size-3 text-[#C47935]" /> Walk-ins welcome • Free Wi-Fi
            </span>
            <button
              type="button"
              onClick={() => setReservationOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs hover:bg-[#C47935] transition-all cursor-pointer active:scale-95"
            >
              <Calendar className="size-3 text-[#C47935]" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>

        {/* ── 2. Right Card: Send an Enquiry Form (Equal Width & Height) ── */}
        <div className="h-full flex flex-col justify-between rounded-2xl border border-[#E5DDD1] bg-white p-4 sm:p-5 lg:p-6 shadow-xs">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1]/70 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#C47935] shadow-2xs">
                  <Mail className="size-4" />
                </span>
                <div>
                  <h2 className="font-editorial text-base sm:text-lg font-bold text-[#1C1510] leading-none">
                    Send an Enquiry
                  </h2>
                  <p className="text-[10px] text-[#6B5E52] mt-0.5">Tables, private events, or questions</p>
                </div>
              </div>
              <span className="text-[10px] text-[#6B5E52] font-medium bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E5DDD1]/60">
                Replies in 2-4 hrs
              </span>
            </div>

            {/* Compact Form */}
            <ContactForm />
          </div>

          {/* Bottom Direct Contact Footer */}
          <div className="pt-3 border-t border-[#E5DDD1]/70 flex items-center justify-between text-[11px] text-[#6B5E52] mt-2">
            <span>Direct: <strong className="text-[#1C1510] font-semibold">{siteConfig.contact.phoneDisplay}</strong></span>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[#C47935] font-semibold hover:underline">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>

      {/* Table Reservation Modal Trigger */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </div>
  );
}
