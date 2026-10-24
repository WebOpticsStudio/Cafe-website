import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import './globals.css';

// Self-hosted fonts via next/font (zero render-blocking external network requests)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const display = localFont({
  src: '../assets/fonts/bricolage-grotesque-latin-wght-normal.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
  display: 'swap',
});

const sans = localFont({
  src: '../assets/fonts/instrument-sans-latin-wght-normal.woff2',
  variable: '--font-instrument',
  weight: '400 700',
  display: 'swap',
});

const title = `${siteConfig.name} – ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    url: '/',
    locale: siteConfig.locale.replace('-', '_'),
  },
  twitter: { card: 'summary_large_image', title, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#18120E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteConfig.locale}
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${playfair.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
