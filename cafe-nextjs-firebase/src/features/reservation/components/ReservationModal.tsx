'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle2, X, Sparkles, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
}

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

export function ReservationModal({ isOpen, onClose, defaultDate, defaultTime }: ReservationModalProps) {
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>(defaultDate ?? new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>(defaultTime ?? '10:00 AM');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'BRW-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const getWhatsAppBookingUrl = () => {
    const text = encodeURIComponent(
      `Hello ${siteConfig.name}! I would like to confirm my table reservation (Ref: ${bookingRef}).\n\nName: ${name}\nGuests: ${guests}\nDate: ${date}\nTime: ${time}\nPhone: ${phone}${notes ? `\nRequests: ${notes}` : ''}`
    );
    return `https://wa.me/${siteConfig.whatsapp.number || '11234567890'}?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#120D0A]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5DDD1] bg-[#FAF7F2] shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5DDD1] bg-[#FAF7F2] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#C47935]/15 text-[#C47935]">
              <Calendar className="size-4" />
            </span>
            <h2 id="reservation-title" className="font-editorial text-xl font-bold text-[#1C1510]">
              {isSubmitted ? 'Reservation Confirmed' : 'Reserve a Table'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#6B5E52] hover:bg-[#EBE2D3]/60 hover:text-[#1C1510] transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          {isSubmitted ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="mt-4 font-editorial text-2xl font-bold text-[#1C1510]">
                We Look Forward to Welcoming You!
              </h3>
              <p className="mt-2 text-sm text-[#6B5E52]">
                Your table has been reserved at <span className="font-semibold text-[#1C1510]">{siteConfig.name}</span>.
              </p>

              <div className="my-6 rounded-xl border border-[#E5DDD1] bg-[#F4EFE6] p-4 text-left">
                <div className="flex justify-between border-b border-[#E5DDD1] pb-2 text-xs uppercase tracking-wider text-[#6B5E52]">
                  <span>Booking Reference</span>
                  <span className="font-mono font-bold text-[#C47935]">{bookingRef}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-[#1C1510]">
                  <div>
                    <span className="block text-xs text-[#6B5E52]">Party Size</span>
                    <span className="font-semibold">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#6B5E52]">Time & Date</span>
                    <span className="font-semibold">{time}, {date}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#6B5E52]">Guest Name</span>
                    <span className="font-semibold">{name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#6B5E52]">Contact</span>
                    <span className="font-semibold">{phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <a
                  href={getWhatsAppBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                  <MessageSquare className="size-4" />
                  Send Confirmation to WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-[#1C1510] px-5 py-2.5 text-sm font-semibold text-[#1C1510] hover:bg-[#1C1510] hover:text-white transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#6B5E52]">
                Bookings are confirmed instantly. For parties larger than 8, please contact us directly via WhatsApp.
              </p>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                  Number of Guests
                </label>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                        guests === num
                          ? 'border-[#1C1510] bg-[#1C1510] text-white shadow-sm'
                          : 'border-[#E5DDD1] bg-white text-[#1C1510] hover:border-[#C47935]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                    Select Date
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border border-[#E5DDD1] bg-white px-3 py-2 text-sm text-[#1C1510] focus:border-[#C47935] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-time" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                    Select Time
                  </label>
                  <select
                    id="res-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#E5DDD1] bg-white px-3 py-2 text-sm text-[#1C1510] focus:border-[#C47935] focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                    Full Name
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-white px-3.5 py-2 text-sm text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                      Phone Number
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      placeholder="(123) 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-white px-3.5 py-2 text-sm text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="res-email" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                      Email Address
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-white px-3.5 py-2 text-sm text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-notes" className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="res-notes"
                    rows={2}
                    placeholder="Window seat, anniversary, dietary allergies, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-white px-3.5 py-2 text-sm text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1510] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#120D0A] transition-all active:scale-[0.99]"
                >
                  <Sparkles className="size-4 text-[#C47935]" />
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
