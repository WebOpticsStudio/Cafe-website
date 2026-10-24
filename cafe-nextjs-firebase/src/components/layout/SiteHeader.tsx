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
import { InstagramIcon, FacebookIcon, TwitterIcon, YouTubeIcon } from '@/components/ui/icons';
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
  const [activeNav, setActiveNav] = useState<string>('Home');
  const { totalCount, setIsCartOpen } = useCart();

  // Strictly the requested 6 primary links
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Menu', href: '/menu' },
    { label: 'Specials', href: '/#specials' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact Us', href: '/visit' },
  ];

  // Synchronize active link based on current route pathname & hash
  useEffect(() => {
    const syncActiveNav = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (pathname === '/about') {
        setActiveNav('About Us');
      } else if (pathname === '/menu' || pathname.startsWith('/menu/')) {
        setActiveNav('Menu');
      } else if (pathname === '/visit' || pathname === '/contact') {
        setActiveNav('Contact Us');
      } else if (pathname === '/') {
        if (hash === '#specials') {
          setActiveNav('Specials');
        } else if (hash === '#gallery') {
          setActiveNav('Gallery');
        } else if (hash === '#about') {
          setActiveNav('About Us');
        } else {
          setActiveNav('Home');
        }
      }
    };

    syncActiveNav();
    window.addEventListener('hashchange', syncActiveNav);
    return () => window.removeEventListener('hashchange', syncActiveNav);
  }, [pathname]);

  // Handle incoming hash anchors when navigating from other pages to home
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      if (hash === '#specials') setActiveNav('Specials');
      else if (hash === '#gallery') setActiveNav('Gallery');
      else if (hash === '#about') setActiveNav('About Us');

      const targetId = hash.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => {
          const headerHeight = 64;
          const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementTop - headerHeight),
            behavior: 'smooth',
          });
        }, 120);
      }
    }
  }, [pathname]);

  // Scroll spy on home page to keep active indicator synchronized while scrolling
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = [
      { id: 'specials', label: 'Specials' },
      { id: 'about', label: 'About Us' },
      { id: 'gallery', label: 'Gallery' },
    ];

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveNav('Home');
        return;
      }

      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(section.label);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Single-click handler that immediately scrolls to section on home page flush under sticky navbar
  const handleNavClick = (e: React.MouseEvent, link: { label: string; href: string }) => {
    setActiveNav(link.label);

    if (link.href.startsWith('/#')) {
      const targetId = link.href.replace('/#', '');
      if (pathname === '/') {
        e.preventDefault();
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerHeight = 64;
          const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementTop - headerHeight),
            behavior: 'smooth',
          });
          window.history.pushState(null, '', `#${targetId}`);
        }
      }
    } else if (link.href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const isLinkActive = (link: { label: string; href: string }) => {
    return activeNav === link.label;
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
              <span className="hidden sm:inline">#123, 2nd Main, 4th Cross, Marathahalli, Bengaluru 560037</span>
              <span className="sm:hidden">Marathahalli, Bengaluru</span>
            </span>
          </div>

          {/* Center: Mon - Sun / Mon - Fri Timings */}
          <div className="hidden md:flex items-center justify-center text-center">
            <span className="flex items-center gap-1.5 text-[#DDD0BC]">
              <Clock className="size-3 text-[#C47935] shrink-0" />
              <span>Mon - Sun: 7:00 AM - 10:00 PM</span>
            </span>
          </div>

          {/* Right: Phone & Clearly Mentioned Social Icons */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <a
              href={`tel:${siteConfig.contact.phoneTel}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium text-[#FAF7F2]"
            >
              <Phone className="size-3 text-[#C47935] shrink-0" />
              <span className="hidden sm:inline">{siteConfig.contact.phoneDisplay}</span>
            </a>

            {/* Clearly Mentioned Social Media Section */}
            <div className="flex items-center gap-2 border-l border-[#33261E] pl-2.5 sm:pl-3">
              <span className="text-[10px] uppercase font-bold text-[#C47935] tracking-wider hidden sm:inline">
                Follow Us:
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href="https://instagram.com/brewista.cafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Follow us on Instagram"
                  className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#DDD0BC] hover:bg-[#E1306C] hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <InstagramIcon width={13} height={13} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                  className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#DDD0BC] hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <FacebookIcon width={13} height={13} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  title="Follow us on X / Twitter"
                  className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#DDD0BC] hover:bg-[#1DA1F2] hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <TwitterIcon width={13} height={13} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="Follow us on YouTube"
                  className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#DDD0BC] hover:bg-[#FF0000] hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <YouTubeIcon width={13} height={13} />
                </a>
              </div>
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
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-xs font-semibold tracking-wider transition-colors relative py-1.5 ${
                    isActive ? 'text-[#C47935] font-bold' : 'text-[#1C1510] hover:text-[#C47935]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C47935] rounded-full transition-all" />
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
                    onClick={(e) => {
                      handleNavClick(e, link);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-sm font-semibold tracking-wider transition-colors py-1.5 relative w-fit ${
                      isActive ? 'text-[#C47935] font-bold' : 'text-[#1C1510] hover:text-[#C47935]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C47935] rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-[#E5DDD1] flex flex-col gap-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C47935]">
                    Follow Us:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://instagram.com/brewista.cafe"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      title="Follow us on Instagram"
                      className="flex size-7 items-center justify-center rounded-full bg-[#1C1510] text-[#FAF7F2] hover:bg-[#E1306C] transition-all"
                    >
                      <InstagramIcon width={13} height={13} />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      title="Follow us on Facebook"
                      className="flex size-7 items-center justify-center rounded-full bg-[#1C1510] text-[#FAF7F2] hover:bg-[#1877F2] transition-all"
                    >
                      <FacebookIcon width={13} height={13} />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter / X"
                      title="Follow us on Twitter / X"
                      className="flex size-7 items-center justify-center rounded-full bg-[#1C1510] text-[#FAF7F2] hover:bg-[#1DA1F2] transition-all"
                    >
                      <TwitterIcon width={13} height={13} />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      title="Follow us on YouTube"
                      className="flex size-7 items-center justify-center rounded-full bg-[#1C1510] text-[#FAF7F2] hover:bg-[#FF0000] transition-all"
                    >
                      <YouTubeIcon width={13} height={13} />
                    </a>
                  </div>
                </div>
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
