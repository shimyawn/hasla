import type { Lang, UIStrings } from './types'

export const UI: Record<Lang, UIStrings> = {
  ko: {
    splashLabel: '강릉 이머시브 아트 쇼',
    splashSloganLine1: '다섯개의 달이 피어오르는 밤,',
    splashSloganLine2: '고대 하슬라의 판타지가 펼쳐집니다.',
    splashHint: 'TAP TO AWAKEN',
    splashCta: '숲으로 들어가기',
    copyrightSuffix: '강릉 경포 환상의 호수',

    navHome: '← HOME',
    navMap: '← MAP',
    navHomeKey: '처음으로',

    toggleMap: '지도보기',
    toggleList: '목록보기',
    mapCaption: '빛나는 영역을 탭하면 각 ZONE의 안내로 이동합니다.',

    sectionDirection: '연출 방향',
    sectionMedia: '연출 매체',
    navBackToMap: '맵으로 돌아가기',
    navFinish: 'FINISH →',
    navFirst: '처음으로',
    zoneTotalSeparator: '/',

    viewDetail: '자세히 보기 →',

    elementWater: '수(水)',
    elementWood: '목(木)',
    elementEarth: '토(土)',
    elementFire: '화(火)',
    elementMetal: '금(金)',

    metaTitle: '경포 환상의 호수',
    metaSubtitle: '고대 하슬라의 밤',
    metaFullTitle: '경포 환상의 호수 — 고대 하슬라의 밤',
    slogan: '다섯개의 달이 피어오르는 밤, 고대 하슬라의 판타지가 펼쳐집니다',
    concept: '다섯 개의 달이 뜬 밤, 고대 하슬라의 모습이 재현된다.',

    langToggleLabel: 'LANGUAGE',

    infoButtonLabel: 'INFO',
    infoSheetTitle: '운영 안내',
    infoPreOpenLabel: '공지',
    infoPreOpenLineShort: '지금은 가오픈 기간입니다',
    infoNoticeParagraphs: [
      '현재 HASLA는 정식 개관을 앞둔 가오픈 기간입니다.',
      '시스템 최적화를 위한 시운영 단계로, 일부 관람 및 이용이 제한될 수 있는 점 방문객 여러분의 너른 양해 부탁드립니다.',
      '2026년 7월 중순, 그랜드 오픈 예정이니 더욱 완벽한 모습으로 정식 인사드리겠습니다. HASLA에 보내주시는 많은 관심과 기대 부탁드립니다.',
    ],
    infoSessionsHeading: '인피니티 포레스트 조명쇼 타임테이블',
    infoSessionsNote: '매일 19:30부터 21:30까지, 30분 간격 4회 송출됩니다.',
    infoGrandOpenLabel: '그랜드 오픈',
    infoGrandOpenWhen: '2026년 7월 중순 예정',
    infoCloseLabel: '닫기',
    infoPerDayLabel: '1일 4타임',
    splashStatusBanner: '지금은 가오픈 기간입니다 · 1일 4타임 송출 · 그랜드 오픈 2026년 7월 중순 예정',

    tabHome: '메인',
    tabAbout: 'HASLA 소개',
    tabShow: '상영시간표',
    tabReviews: '리뷰',

    aboutPageTitle: 'HASLA 소개',
    showPageTitle: '상영시간표',
    reviewsPageTitle: '리뷰',
    comingSoonLabel: 'COMING SOON',
    comingSoonNote: '곧 공개됩니다.',

    aboutTeaserLabel: '티저',
    aboutTeaserHeading: '한 발 앞서 만나는 하슬라의 밤',
    aboutTeaserNote: '티저 영상은 곧 공개됩니다.',

    reviewsIntro: '관람 후 느낀 빛과 울림을 들려주세요. 여러분의 한 마디가 숲을 더 깊이 깨웁니다.',
    reviewsCta: '리뷰 작성하러 가기',
    reviewsOpenInNewTab: '새 창에서 열기',
  },

  en: {
    splashLabel: 'GANGNEUNG IMMERSIVE ART SHOW',
    splashSloganLine1: 'On a night when five moons rise,',
    splashSloganLine2: "the fantasy of ancient Hasla unfolds.",
    splashHint: 'TAP TO AWAKEN',
    splashCta: 'Enter the Forest',
    copyrightSuffix: 'Gyeongpo Fantastic Lake, Gangneung',

    navHome: '← HOME',
    navMap: '← MAP',
    navHomeKey: 'Home',

    toggleMap: 'Map',
    toggleList: 'List',
    mapCaption: 'Tap a glowing zone to view its details.',

    sectionDirection: 'Direction',
    sectionMedia: 'Production Media',
    navBackToMap: 'Back to map',
    navFinish: 'FINISH →',
    navFirst: 'Home',
    zoneTotalSeparator: '/',

    viewDetail: 'View details →',

    elementWater: 'Water',
    elementWood: 'Wood',
    elementEarth: 'Earth',
    elementFire: 'Fire',
    elementMetal: 'Metal',

    metaTitle: 'Gyeongpo Fantastic Lake',
    metaSubtitle: 'Night of Ancient Hasla',
    metaFullTitle: 'Gyeongpo Fantastic Lake — Night of Ancient Hasla',
    slogan: 'On a night when five moons rise, the fantasy of ancient Hasla unfolds',
    concept: 'When five moons rise, the world of ancient Hasla returns.',

    langToggleLabel: 'LANGUAGE',

    infoButtonLabel: 'INFO',
    infoSheetTitle: 'Operating Information',
    infoPreOpenLabel: 'Notice',
    infoPreOpenLineShort: 'Currently in soft-open period',
    infoNoticeParagraphs: [
      'HASLA is currently in a soft-open period ahead of its official grand opening.',
      'During this system-optimization phase, some areas and services may be limited. We sincerely appreciate your understanding.',
      'The grand opening is planned for mid-July 2026. We look forward to greeting you again in our complete form, and thank you for your continued interest in HASLA.',
    ],
    infoSessionsHeading: 'Infinity Forest Light Show — Timetable',
    infoSessionsNote: 'Daily, four 30-minute sessions between 19:30 and 21:30.',
    infoGrandOpenLabel: 'Grand Opening',
    infoGrandOpenWhen: 'Mid-July 2026 (planned)',
    infoCloseLabel: 'Close',
    infoPerDayLabel: '4 sessions/day',
    splashStatusBanner: 'Currently in soft-open · 4 sessions/day · Grand opening mid-July 2026',

    tabHome: 'Home',
    tabAbout: 'About HASLA',
    tabShow: 'Show Schedule',
    tabReviews: 'Reviews',

    aboutPageTitle: 'About HASLA',
    showPageTitle: 'Show Schedule',
    reviewsPageTitle: 'Reviews',
    comingSoonLabel: 'COMING SOON',
    comingSoonNote: 'Coming soon.',

    aboutTeaserLabel: 'Teaser',
    aboutTeaserHeading: 'A Glimpse of the Hasla Night',
    aboutTeaserNote: 'The teaser video will be released soon.',

    reviewsIntro: 'Tell us about the light and resonance you felt. Your words help the forest awaken further.',
    reviewsCta: 'Leave a review',
    reviewsOpenInNewTab: 'Open in new tab',
  },
}
