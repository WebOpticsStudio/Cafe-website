'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50/60 p-5 text-center my-auto">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-xs">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="font-editorial text-base font-bold text-[#1C1510]">
          Thank you for reaching out!
        </h3>
        <p className="mt-1 text-[11px] text-[#6B5E52] max-w-sm leading-relaxed">
          We have received your enquiry and our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#C47935] transition-all cursor-pointer shadow-2xs"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E52]">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="e.g. Maya Lin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:bg-white focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E52]">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="maya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:bg-white focus:outline-none transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Row 2: Phone & Reason */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E52]">
            Phone Number (Optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:bg-white focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E52]">
            Enquiry Type
          </label>
          <select
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1C1510] focus:border-[#C47935] focus:bg-white focus:outline-none transition-colors shadow-2xs cursor-pointer"
          >
            <option value="General Enquiry">General Enquiry</option>
            <option value="Table Reservation">Table Reservation / Large Party</option>
            <option value="Event or Catering">Private Event or Catering</option>
            <option value="Dietary & Menu">Dietary / Allergen Question</option>
            <option value="Feedback">Customer Feedback</option>
          </select>
        </div>
      </div>

      {/* Row 3: Message Textarea */}
      <div>
        <label htmlFor="contact-message" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E52]">
          Your Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={2}
          placeholder="How can we help you? Tell us about your party size, date, or questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E5DDD1] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:bg-white focus:outline-none transition-colors resize-none shadow-2xs"
        />
      </div>

      {/* Row 4: Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1C1510] py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#C47935] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
      >
        <Send className="size-3 text-[#C47935]" />
        <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
      </button>
    </form>
  );
}
