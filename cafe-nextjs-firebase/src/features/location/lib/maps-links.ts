/**
 * Google Maps URL builders.
 *   • Directions and search links use the keyless "Maps URLs" scheme – always free.
 *   • The interactive embed needs a (public, referrer-restricted) Maps Embed API key.
 */
// https://developers.google.com/maps/documentation/urls/get-started

export interface MapsTarget {
  /** Human-readable address. */
  address: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

function destinationOf(target: MapsTarget): string {
  return target.address;
}

export function buildDirectionsUrl(target: MapsTarget): string {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', destinationOf(target));
  if (target.placeId) url.searchParams.set('destination_place_id', target.placeId);
  return url.toString();
}

export function buildMapsSearchUrl(target: MapsTarget): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', destinationOf(target));
  if (target.placeId) url.searchParams.set('query_place_id', target.placeId);
  return url.toString();
}

export function buildEmbedUrl(target: MapsTarget, apiKey: string): string {
  const url = new URL('https://www.google.com/maps/embed/v1/place');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('q', target.placeId ? `place_id:${target.placeId}` : destinationOf(target));
  return url.toString();
}
