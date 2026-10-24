'use client';

import { siteConfig } from '@/config/site';

/**
 * Clean, minimal, recognizable WhatsApp floating icon.
 * Unobtrusive, accessible, with no extra text or banners.
 */
export function FloatingWhatsApp() {
  const number = siteConfig.whatsapp.number || '11234567890';
  const message = encodeURIComponent(siteConfig.whatsapp.message);
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      {/* Official WhatsApp silhouette icon */}
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM9.11 7.64C8.94 7.64 8.66 7.7 8.43 7.95C8.19 8.21 7.53 8.83 7.53 10.09C7.53 11.35 8.45 12.57 8.58 12.74C8.71 12.91 10.38 15.5 12.97 16.61C13.59 16.87 14.07 17.03 14.45 17.15C15.07 17.35 15.63 17.32 16.08 17.25C16.58 17.18 17.61 16.63 17.83 16.02C18.05 15.41 18.05 14.88 17.98 14.77C17.91 14.66 17.74 14.6 17.48 14.47C17.22 14.34 15.95 13.71 15.71 13.62C15.47 13.53 15.3 13.49 15.13 13.75C14.96 14.01 14.47 14.6 14.32 14.77C14.17 14.94 14.02 14.96 13.76 14.83C13.5 14.7 12.67 14.43 11.68 13.55C10.91 12.86 10.39 12.01 10.24 11.75C10.09 11.49 10.22 11.35 10.35 11.22C10.47 11.1 10.61 10.92 10.74 10.77C10.87 10.62 10.92 10.51 11 10.34C11.08 10.17 11.04 10.02 10.98 9.9C10.92 9.78 10.43 8.58 10.23 8.09C10.03 7.61 9.83 7.68 9.68 7.67C9.54 7.66 9.37 7.64 9.11 7.64Z" />
      </svg>
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
}
