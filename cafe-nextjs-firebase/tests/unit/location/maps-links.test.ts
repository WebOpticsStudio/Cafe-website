import { describe, expect, it } from 'vitest';
import {
  buildDirectionsUrl,
  buildEmbedUrl,
  buildMapsSearchUrl,
} from '@/features/location/lib/maps-links';

const target = { address: '123 Example Street, Springfield, NY 10001' };

describe('maps links', () => {
  it('builds a keyless directions URL', () => {
    const url = new URL(buildDirectionsUrl(target));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('destination')).toBe(target.address);
    expect(url.searchParams.has('destination_place_id')).toBe(false);
  });

  it('adds the place id when known', () => {
    const url = new URL(buildDirectionsUrl({ ...target, placeId: 'ChIJ123' }));
    expect(url.searchParams.get('destination_place_id')).toBe('ChIJ123');
  });

  it('builds search and embed URLs', () => {
    expect(new URL(buildMapsSearchUrl(target)).searchParams.get('query')).toBe(target.address);
    const embed = new URL(buildEmbedUrl({ ...target, placeId: 'ChIJ123' }, 'KEY'));
    expect(embed.pathname).toBe('/maps/embed/v1/place');
    expect(embed.searchParams.get('key')).toBe('KEY');
    expect(embed.searchParams.get('q')).toBe('place_id:ChIJ123');
  });
});
