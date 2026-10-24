import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const alt = `${siteConfig.name} – ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated social-sharing image – no design asset needed. Replace with a photo when available. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 90,
        background: '#153a2f',
        color: '#ffffff',
      }}
    >
      <div style={{ fontSize: 40, color: '#f7cf6b' }}>{siteConfig.name}</div>
      <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1, marginTop: 24 }}>
        {siteConfig.tagline}
      </div>
      <div style={{ fontSize: 34, marginTop: 36, opacity: 0.8 }}>{siteConfig.description}</div>
    </div>,
    size,
  );
}
