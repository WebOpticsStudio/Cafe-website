import { formatAddress, siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { buildDirectionsUrl } from '../lib/maps-links';
import { MapEmbed } from './MapEmbed';

export function LocationCard() {
  const directionsHref = buildDirectionsUrl({
    address: formatAddress(),
    placeId: siteConfig.maps.placeId,
  });

  return (
    <div className="space-y-5">
      <MapEmbed />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <address className="text-lg not-italic">
          <span className="font-semibold">{siteConfig.name}</span>
          <br />
          {siteConfig.address.streetAddress}
          <br />
          {siteConfig.address.locality}, {siteConfig.address.region} {siteConfig.address.postalCode}
        </address>
        <ButtonLink href={directionsHref} variant="primary">
          Get directions
        </ButtonLink>
      </div>
    </div>
  );
}
