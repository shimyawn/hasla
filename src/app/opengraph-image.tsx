import { ImageResponse } from 'next/og'
import { promises as fs } from 'fs'
import path from 'path'

// Run on the Node runtime so we can read the local font file from disk.
export const runtime = 'nodejs'

export const alt = '경포 환상의 호수 — 고대 하슬라의 밤'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontPath = path.join(
    process.cwd(),
    'src',
    'fonts',
    'yoon-meoli-light.ttf',
  )
  const fontData = await fs.readFile(fontPath)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 50% 45%, #3a1d4f 0%, #1a0a26 55%, #000000 100%)',
          color: 'white',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Soft brand-color halo behind the wordmark */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 800px 400px at 50% 55%, rgba(255,81,132,0.18), transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Eyebrow — Latin only, no font fallback issues */}
        <div
          style={{
            fontSize: 28,
            letterSpacing: '0.45em',
            color: 'rgba(255, 208, 106, 0.9)',
            marginBottom: 36,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          GANGNEUNG IMMERSIVE ART SHOW
        </div>

        {/* Main Korean wordmark */}
        <div
          style={{
            fontFamily: 'Yoon',
            fontSize: 110,
            fontWeight: 300,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            display: 'flex',
            lineHeight: 1.1,
          }}
        >
          경포 환상의 호수
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'Yoon',
            fontSize: 52,
            color: 'rgba(255, 255, 255, 0.78)',
            marginTop: 24,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          고대 하슬라의 밤
        </div>

        {/* Slogan at bottom */}
        <div
          style={{
            fontFamily: 'Yoon',
            fontSize: 30,
            color: 'rgba(255, 255, 255, 0.55)',
            marginTop: 60,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          다섯 개의 달이 뜨는 밤
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Yoon',
          data: fontData,
          style: 'normal',
          weight: 300,
        },
      ],
    },
  )
}
