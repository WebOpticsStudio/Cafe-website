import { siteConfig, formatAddress } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { MapPinIcon } from '@/components/ui/icons';
import { buildEmbedUrl, buildMapsSearchUrl } from '../lib/maps-links';

/**
 * Interactive Google Map when a Maps Embed API key is configured; otherwise a static
 * location panel with an "Open in Google Maps" link (no key, no cost, no third-party iframe).
 */
export function MapEmbed() {
  const target = { address: formatAddress(), placeId: siteConfig.maps.placeId };
  const apiKey = siteConfig.maps.embedApiKey;

  if (apiKey) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-line">
        <iframe
          title={`Map showing the location of ${siteConfig.name}`}
          src={buildEmbedUrl(target, apiKey)}
          className="size-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-xl border border-line bg-forest-50 p-6 text-center">
      <MapPinIcon width={36} height={36} className="text-forest-700" />
      <p className="max-w-xs text-lg font-medium">{formatAddress()}</p>
      <ButtonLink href={buildMapsSearchUrl(target)} variant="outline" size="sm">
        Open in Google Maps
      </ButtonLink>
    </div>
  );
}
