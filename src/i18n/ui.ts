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

    audioTitleDefault: '오디오 도슨트',
    audioTapToPlay: '화면을 탭하면 재생됩니다.',
    audioError: '오디오 파일이 아직 준비되지 않았습니다.',
    ariaPlay: '재생',
    ariaPause: '일시정지',
    ariaSeek: '재생 위치',

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
    infoPreOpenLabel: '가오픈 기간',
    infoPreOpenLineShort: '지금은 가오픈 기간입니다',
    infoSessionsHeading: '송출 시간',
    infoSessionsNote: '매일 19:30부터 21:30까지, 30분 간격 4회 송출됩니다.',
    infoGrandOpenLabel: '그랜드 오픈',
    infoGrandOpenWhen: '2026년 7월 중순 예정',
    infoCloseLabel: '닫기',
    infoPerDayLabel: '1일 4타임',
    splashStatusBanner: '지금은 가오픈 기간입니다 · 1일 4타임 송출 · 그랜드 오픈 2026년 7월 중순 예정',
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

    audioTitleDefault: 'Audio Docent',
    audioTapToPlay: 'Tap the screen to play.',
    audioError: 'Audio is not yet available.',
    ariaPlay: 'Play',
    ariaPause: 'Pause',
    ariaSeek: 'Seek position',

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
    infoPreOpenLabel: 'Soft Open Period',
    infoPreOpenLineShort: 'Currently in soft-open period',
    infoSessionsHeading: 'Show Times',
    infoSessionsNote: 'Daily, four 30-minute sessions between 19:30 and 21:30.',
    infoGrandOpenLabel: 'Grand Opening',
    infoGrandOpenWhen: 'Mid-July 2026 (planned)',
    infoCloseLabel: 'Close',
    infoPerDayLabel: '4 sessions/day',
    splashStatusBanner: 'Currently in soft-open · 4 sessions/day · Grand opening mid-July 2026',
  },
}
