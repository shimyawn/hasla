import { ImageResponse } from 'next/og'

// 180x180 PNG — Next.js wires this as <link rel="apple-touch-icon">.
// Used when iOS users 'Add to Home Screen', and as the share preview
// thumbnail in iMessage / KakaoTalk on iOS. Same brand-gradient moon
// motif as icon.tsx, just larger so the moon fills the rounded tile
// nicely without iOS adding its own glossy mask.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #FFD06A 0%, #FF8653 28%, #FF5184 55%, #B96AC7 78%, #21A3DD 100%)',
            boxShadow:
              '0 0 28px rgba(255, 208, 106, 0.45), 0 0 48px rgba(255, 81, 132, 0.25)',
            display: 'flex',
          }}
        />
      </div>
    ),
    size,
  )
}
