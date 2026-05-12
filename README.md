# HASLA — 경포 환상의 호수

강릉 경포호 일대에서 열리는 몰입형 미디어 아트쇼 **하슬라**의 모바일 리플렛 웹앱입니다.
관람객이 야간에 8개 존을 걸으며 작품을 감상할 때, 스토리 · 지도 · 일정 · 피드백을 제공하는 디지털 가이드 역할을 합니다.

**Live:** https://hasla-gangneung.vercel.app

## Features

- 8개 존별 작품 소개, 스토리, 동선 안내
- 인터랙티브 지도 (존 아이콘 탭 → 상세 → 이동)
- 한국어 / English 전환
- 스플래시 문라이즈 애니메이션
- 반응형 (모바일 우선 + PC 레이아웃)
- SEO 최적화 (동적 OG 이미지, JSON-LD Event, 사이트맵)
- Vercel Analytics + Speed Insights

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- Vercel 자동 배포

## Getting Started

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Project Structure

```
src/
  app/
    page.tsx / SplashClient.tsx     # 스플래시 (문라이즈 애니메이션)
    (tabs)/
      map/                          # 인터랙티브 존 지도
      about/                        # 전시 소개 + 관람 안내
      show/                         # 전시 정보
      feedback/                     # 피드백 + 연락처
    zone/[id]/                      # 8개 존 상세 페이지
  components/                       # HeaderBar, BottomTabs, ContactBlock 등
  data/zones.json                   # 존 데이터 (핀 좌표 포함)
  i18n/                             # 한/영 다국어 텍스트
public/
  images/                           # 로고, 지도, 존별 메인 이미지
  videos/teaser.mp4                 # 티저 영상
```
