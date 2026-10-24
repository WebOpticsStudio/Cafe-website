'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Clock,
  Phone,
  Coffee,
  ShoppingBag,
  Calendar,
  Menu as MenuIcon,
  X as CloseIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { useCart } from '@/context/CartContext';

const ReservationModal = dynamic(
  () => import('@/features/reservation/components/ReservationModal').then((m) => m.ReservationModal),
  { ssr: false }
);

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const { totalCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(typeof window !== 'undefined' ? window.location.hash : '');
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  // Strictly the requested 6 primary links
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Menu', href: '/menu' },
    { label: 'Specials', href: '/#specials' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact Us', href: '/visit' },
  ];

  const isLinkActive = (link: { label: string; href: string }) => {
    if (link.label === 'About Us') {
      return pathname === '/about' || currentHash === '#about';
    }
    if (link.label === 'Menu') {
      return pathname === '/menu' || pathname.startsWith('/menu/');
    }
    if (link.label === 'Contact Us') {
      return pathname === '/visit' || pathname === '/contact';
    }
    if (link.label === 'Specials') {
      return currentHash === '#specials';
    }
    if (link.label === 'Gallery') {
      return currentHash === '#gallery';
    }
    if (link.label === 'Home') {
      return pathname === '/' && !currentHash;
    }
    return pathname === link.href;
  };

  return (
    <>
      {/* ── Top Announcement Bar (Dark Espresso) ── */}
      <div className="bg-[#18120E] text-[11px] text-[#DDD0BC] tracking-wider border-b border-[#2A1F18]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-3 items-center px-4 py-1.5 sm:px-6 lg:px-8">
          {/* Left: Address */}
          <div className="flex items-center justify-start">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="size-3 text-[#C47935] shrink-0" />
              <span className="hidden sm:inline">123 Coffee Street, Brooklyn, NY 11201</span>
              <span className="sm:hidden">Brooklyn, NY</span>
            </span>
          </div>

          {/* Center: Mon - Sun / Mon - Fri Timings */}
          <div className="hidden md:flex items-center justify-center text-center">
            <span className="flex items-center gap-1.5 text-[#DDD0BC]">
              <Clock className="size-3 text-[#C47935] shrink-0" />
              <span>Mon - Sun: 7:00 AM - 10:00 PM</span>
            </span>
          </div>

          {/* Right: Phone & Social Icons */}
          <div className="flex items-center justify-end gap-4">
            <a
              href="tel:+11234567890"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <Phone className="size-3 text-[#C47935] shrink-0" />
              <span>(123) 456-7890</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 border-l border-[#33261E] pl-3 text-[#B8A898]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <FacebookIcon width={12} height={12} />
              </a>
              <a
                href="https://instagram.com/brewista.cafe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <InstagramIcon width={12} height={12} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-white transition-colors"
              >
                <TwitterIcon width={12} height={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Nav Bar ── */}
      <header className="sticky top-0 z-40 border-b border-[#E5DDD1] bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#1C1510] text-[#FAF7F2] shadow-xs transition-transform group-hover:scale-105">
              <Coffee className="size-4 text-[#C47935]" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#1C1510] leading-none">
                Brewista
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#6B5E52] mt-0.5 font-semibold">
                Coffee & Eatery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wider transition-colors relative py-1 ${
                    isActive ? 'text-[#C47935] font-bold' : 'text-[#1C1510] hover:text-[#C47935]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C47935] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Top-Right Actions: Cart & Reserve a Table */}
          <div className="flex items-center gap-3">
            {/* Add to Cart / View Cart Action */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full border border-[#E5DDD1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1C1510] hover:border-[#C47935] hover:text-[#C47935] transition-all shadow-2xs cursor-pointer"
              aria-label={`View cart with ${totalCount} items`}
            >
              <ShoppingBag className="size-4 text-[#1C1510]" />
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#C47935] text-[10px] font-bold text-white leading-none">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Reserve a Table Action */}
            <button
              type="button"
              onClick={() => setReservationOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#C47935] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="size-3.5 text-[#C47935]" />
              <span>Reserve a Table</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-9 items-center justify-center rounded-lg border border-[#E5DDD1] text-[#1C1510] hover:bg-[#EBE2D3]/40 lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E5DDD1] bg-[#FAF7F2] px-6 py-4 lg:hidden shadow-lg animate-in slide-in-from-top-1 duration-150">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-semibold tracking-wider transition-colors py-1 ${
                      isActive ? 'text-[#C47935] font-bold' : 'text-[#1C1510] hover:text-[#C47935]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-[#E5DDD1] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setReservationOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1510] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#C47935]"
                >
                  <Calendar className="size-3.5 text-[#C47935]" />
                  Reserve a Table
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Table Reservation Modal */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />
    </>
  );
}
