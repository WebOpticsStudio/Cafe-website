'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Coffee,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer data-surface="dark" className="bg-[#16100C] text-[#FAF7F2] border-t border-[#261D17]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info & Socials (Col 1-4) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#1C1510] shadow-xs">
                <Coffee className="size-4 text-[#C47935]" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-white leading-none">
                  Brewista
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C47935] mt-0.5 font-semibold">
                  Coffee & Eatery
                </span>
              </div>
            </Link>

            <p className="mt-3 max-w-sm text-xs text-[#DDD0BC] leading-relaxed">
              Good coffee, great food, better together. Crafted with passion, roasted in small batches, and served with warmth every single day.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DDD0BC] hover:border-[#C47935] hover:bg-[#C47935] hover:text-white transition-all"
              >
                <FacebookIcon width={13} height={13} />
              </a>
              <a
                href="https://instagram.com/brewista.cafe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DDD0BC] hover:border-[#C47935] hover:bg-[#C47935] hover:text-white transition-all"
              >
                <InstagramIcon width={13} height={13} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DDD0BC] hover:border-[#C47935] hover:bg-[#C47935] hover:text-white transition-all"
              >
                <TwitterIcon width={13} height={13} />
              </a>
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial text-sm font-bold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#DDD0BC]">
              <li>
                <Link href="/" className="hover:text-[#C47935] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#C47935] transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#C47935] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#specials" className="hover:text-[#C47935] transition-colors">
                  Specials
                </Link>
              </li>
              <li>
                <Link href="/visit" className="hover:text-[#C47935] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Menu Categories (Col 7-8) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial text-sm font-bold text-white tracking-wide">
              Our Menu
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#DDD0BC]">
              <li>
                <Link href="/menu#coffee" className="hover:text-[#C47935] transition-colors">
                  Coffee & Espresso
                </Link>
              </li>
              <li>
                <Link href="/menu#breakfast" className="hover:text-[#C47935] transition-colors">
                  Breakfast & Toasts
                </Link>
              </li>
              <li>
                <Link href="/menu#lunch" className="hover:text-[#C47935] transition-colors">
                  Lunch & Savory
                </Link>
              </li>
              <li>
                <Link href="/menu#desserts" className="hover:text-[#C47935] transition-colors">
                  Desserts & Bakes
                </Link>
              </li>
              <li>
                <Link href="/menu#beverages" className="hover:text-[#C47935] transition-colors">
                  Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us (Col 9-10) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial text-sm font-bold text-white tracking-wide">
              Contact Us
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#DDD0BC]">
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 shrink-0 text-[#C47935] mt-0.5" />
                <span>123 Coffee Street, Brooklyn, NY 11201</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-[#C47935]" />
                <a href="tel:+11234567890" className="hover:text-[#C47935] transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-[#C47935]" />
                <a href="mailto:hello@brewista.com" className="hover:text-[#C47935] transition-colors">
                  hello@brewista.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter (Col 11-12) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial text-sm font-bold text-white tracking-wide">
              Newsletter
            </h4>
            <p className="mt-2 text-xs text-[#DDD0BC] leading-relaxed">
              Subscribe to get special offers and updates.
            </p>

            {subscribed ? (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 p-2 text-xs text-emerald-300">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>Thank you!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-3 flex items-stretch">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-l-md border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-[#8C7E72] focus:border-[#C47935] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center rounded-r-md bg-[#C47935] px-3 text-white hover:bg-[#AC6426] transition-colors cursor-pointer"
                >
                  <Send className="size-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A69788]">
          <p>
            © 2026 {siteConfig.name} Coffee & Eatery. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/menu" className="hover:text-white transition-colors">
              Menu
            </Link>
            <span>•</span>
            <Link href="/visit" className="hover:text-white transition-colors">
              Visit
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#C47935]">
              Crafted with <Heart className="size-2.5 fill-[#C47935]" /> in Brooklyn
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
