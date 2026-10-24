import { siteConfig } from '@/config/site';
import { WEEKDAYS, type OpeningHours } from '@/schemas/hours';
import { absoluteUrl } from '@/lib/utils/url';

const SCHEMA_DAY: Record<(typeof WEEKDAYS)[number], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/** schema.org `CafeOrCoffeeShop` – enables rich results (address, hours, links) in search. */
export function buildCafeJsonLd(hours: OpeningHours) {
  const { address, geo, contact, instagram } = siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: absoluteUrl('/opengraph-image'),
    telephone: contact.phoneTel,
    email: contact.email,
    hasMenu: absoluteUrl('/menu'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude },
    openingHoursSpecification: WEEKDAYS.flatMap((day) =>
      (hours.weekly[day] ?? []).map((interval) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAY[day],
        opens: interval.open,
        closes: interval.close,
      })),
    ),
    sameAs: instagram.handle ? [`https://www.instagram.com/${instagram.handle}/`] : undefined,
  };
}
