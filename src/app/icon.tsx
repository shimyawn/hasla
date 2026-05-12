import { ImageResponse } from 'next/og'

// Generated 32x32 PNG. Next.js wires this as <link rel="icon"> for the
// site automatically — replaces the default globe favicon in browser
// tabs and the small icon shown next to bookmarks / KakaoTalk shares.
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          borderRadius: '6px',
        }}
      >
        {/* The 'moon' — a brand-gradient disc, picking up the same hues
            as the splash button and OG image so the favicon reads as
            the same family at a glance. */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #FFD06A 0%, #FF8653 35%, #FF5184 65%, #21A3DD 100%)',
            boxShadow: '0 0 6px rgba(255, 208, 106, 0.55)',
            display: 'flex',
          }}
        />
      </div>
    ),
    size,
  )
}
