'use client';

import { useState } from 'react';
import { Phone, Calendar, MessageSquare, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ReservationModal } from '@/features/reservation/components/ReservationModal';

export function FloatingContactWidget() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const phoneTel = siteConfig.contact.phoneTel;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.number || '11234567890'}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}! I have a quick question or would like to book a table.`
  )}`;

  return (
    <>
      {/* Floating Widget Container */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
        {/* Expanded Quick Action Menu */}
        {expanded && (
          <div className="flex flex-col items-end gap-2 animate-in slide-in-from-bottom-2 duration-200">
            {/* Call Action */}
            <a
              href={`tel:${phoneTel}`}
              className="flex items-center gap-2.5 rounded-full border border-[#E5DDD1] bg-[#1C1510] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-[#C47935] transition-all"
            >
              <Phone className="size-3.5 text-[#C47935]" />
              <span>Call Us</span>
            </a>

            {/* Book Table Action */}
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setReservationOpen(true);
              }}
              className="flex items-center gap-2.5 rounded-full border border-[#E5DDD1] bg-[#1C1510] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-[#C47935] transition-all cursor-pointer"
            >
              <Calendar className="size-3.5 text-[#C47935]" />
              <span>Book Table</span>
            </button>
          </div>
        )}

        {/* Primary Dual Pill Button */}
        <div className="flex items-center rounded-full border border-emerald-600/30 bg-[#1C1510] p-1 shadow-2xl backdrop-blur-md">
          {/* Direct WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
            aria-label="Chat with us on WhatsApp"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            <MessageSquare className="size-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Quick Call Action */}
          <a
            href={`tel:${phoneTel}`}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#DDD0BC] hover:text-white transition-colors"
            aria-label="Call cafe"
          >
            <Phone className="size-3.5 text-[#C47935]" />
            <span className="hidden sm:inline">Call</span>
          </a>

          {/* Toggle More Options */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Close options' : 'More contact options'}
            className="flex size-7 items-center justify-center rounded-full text-[#DDD0BC] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            {expanded ? <X className="size-3.5" /> : <Calendar className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Reservation Modal Triggered from Floating Widget */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  );
}
