import type { Lang, LocalizedZone } from './types'
import { UI } from './ui'

const ko: Record<string, LocalizedZone> = {
  zone1: {
    title: '하슬라 포털',
    subtitle: '달빛이 열어주는 통로',
    tagline: '달 모양의 입구를 통해 신비로운 세상과 통하는 하슬라 포털',
    story:
      '고대 하슬라의 숲으로 향하는 게이트 중 하나, 달빛이 열어주는 달을 닮은 통로입니다.',
    description:
      '송림 사이에 나타난 원형의 포털은 하슬라 세계로 들어가는 관문이자 시작점입니다. 하슬라의 신화와 이야기는 이곳에서 열리며, 포털을 지나면 판타지의 세계가 펼쳐집니다.',
    direction: [
      '달의 형상을 닮은 문을 지나며, 관람객은 현실의 숲에서 신화 속 하슬라의 세계로 진입한다.',
      '빛과 안개가 어우러진 링 형태의 포털을 통해, 관람객이 고대 하슬라의 세계로 진입하는 듯한 체험을 제공한다.',
    ],
    media: ['라인 조명', '원형 입구 조형물', '포그머신'],
    element: UI.ko.elementWater,
  },
  zone2: {
    title: '그루터기의 숨결',
    subtitle: '깨어나 빛으로 맥박하는 그루터기',
    tagline:
      '그루터기가 관람객의 두드림에 화답하며, 빛과 화음으로 숲의 생명을 일깨운다',
    story:
      '당시 하슬라는 달빛 에너지를 받아 모든 동식물이 자유롭게 노래하던 시절이었습니다. 그루터기에 손을 얹으면 빛으로 맥박하며 깨어나고, 각자의 하모니를 쌓아 노래하며 숲의 복귀를 축하합니다.',
    description:
      '달빛이 스며들며 하슬라의 숲이 다시 숨을 쉽니다. 고대의 기억이 남은 그루터기는 노래로 화답하고, 관람객이 그루터기를 두드리면 빛과 사운드가 파동처럼 확산되며 숲의 맥박이 살아나는 연출이 구현됩니다. 관람객 참여를 통해 생명의 기운이 깨어나는 경험을 제공합니다.',
    direction: [
      '각 오브제(그루터기·연못)가 반응형 인터랙션으로 구현되어 관람객이 ‘깨어남’의 순간을 직접 체험.',
      '체험자가 두드리는 타이밍에 맞춰 조명·음향이 연동되며 숲이 맥박하듯 주변으로 빛이 퍼져 나간다.',
    ],
    media: ['모형 그루터기', '라인 조명', '인터랙션 센서', '스피커'],
    element: UI.ko.elementWood,
  },
  zone3: {
    title: '거울 연못',
    subtitle: '달빛을 받아 재현된 하슬라의 연못',
    tagline:
      '달빛을 받은 정원의 연못 위에 하슬라의 생명이 비치고, 관람객이 다가서면 움직임에 반응한다',
    story:
      '달빛 아래 신비한 생명들(빛의 물고기)이 모여드는 비밀의 샘으로, 다가서면 과거 하슬라 시절의 연못이 재현됩니다.',
    description:
      '거울면 위로 달빛과 생명체의 영상이 투사되며, 관람객의 접근에 따라 물결·빛·생명체가 반응하는 인터랙션이 연출됩니다. 가까이 다가서면 도망가는 빛의 물고기를 따라 달빛에 잠긴 연못의 시간을 거닐어 볼 수 있습니다.',
    direction: [
      '스마트 미러 위에 헤엄치는 하슬라의 물고기 영상.',
      '관람객의 접근에 따라 도망가는 물고기 — 인터랙션 센서로 연동.',
    ],
    media: ['스마트 미러', '거울', '인터랙션 센서', '스피커'],
    element: UI.ko.elementWater,
  },
  zone4: {
    title: '다섯 개의 달',
    subtitle: '대왕 그루터기 — 하슬라 숲의 심장',
    tagline:
      '밤하늘로부터 쏟아지는 다섯개의 달빛을 받아내는, 세상에서 가장 큰 소나무 그루터기',
    story:
      '다섯 달빛을 집중적으로 받아 세상에서 가장 크게 자라난, 하슬라 숲의 심장입니다.',
    description:
      '하슬라 시절 가장 큰 소나무가 있던 자리. 거대한 그루터기에서 다섯 줄기의 빛이 수직으로 솟아오르며 다섯 달을 상징합니다. 서치라이트 조명 연출이 잠들었던 하슬라의 부활을 알리고, 신비한 다섯개의 달빛은 하슬라 전역으로 퍼져 나갑니다 — 이 강력한 빛은 하슬라 생태계를 구성하는 모든 에너지의 근원입니다.',
    direction: [
      '서치라이트로 하슬라 대표 컨셉인 다섯 개의 달을 강조.',
      '높게 뜬 다섯 개의 달 연출을 통해 하슬라 세계관의 상징적 의미 전달.',
    ],
    media: ['서치라이트', '대형 그루터기 조형물', '사운드 시스템'],
    element: UI.ko.elementEarth,
  },
  zone5: {
    title: '달의 초상',
    subtitle: '미러 벽체 — 거울에 비친 달',
    tagline: '하늘에 뜬 달을 거울 속에서 마주하는 신비로운 공간',
      story:
      '달빛은 하슬라 숲의 근원이었기에, 사람들은 이 거울에 비친 달의 초상을 통해서만 달과 조우할 수 있었습니다. 거울에 비친 달에게 가만히 소원을 얹어 보세요.',
    description:
      '조명쇼 구간으로 넘어가기 전 시야를 전환하는 전이 공간. 지그재그로 배치된 거울 벽 사이를 걸으며, 관람객은 달빛에 비친 자신의 모습과 달의 잔영을 마주합니다. 반사면에 비친 달과 관람객의 모습이 겹쳐지며 달빛과 내가 하나가 되는 경험을 제공하고, 야간 포토존으로도 활용됩니다.',
    direction: [
      '지그재그 배치된 미러월로 시야를 차폐하고 동선을 유도.',
      '거울에 비친 달빛과 반사로 관람객이 달을 마주하는 경험 구현.',
    ],
    media: ['거울 벽체'],
    element: UI.ko.elementFire,
  },
  zone6: {
    title: '인피니티 포레스트',
    subtitle: '달빛의 창 — 빛의 축제',
    tagline:
      '8M의 LED WALL로 연출하는 몰입형 콘텐츠 — 다섯 개의 달이 차례로 떠오르는 문라이트 쇼',
    story:
      '달빛에너지와 숲이 음악과 빛으로 어우러져, 고대 하슬라 숲의 신비로운 세계를 재현하는 체험의 장입니다. 다섯 달의 세계를 비추는 거대한 포털이자, 하늘에 뜬 달들을 엿보는 신비로운 창입니다.',
    description:
      '송림 사이에 설치된 약 8m 규모의 LED WALL로 끝없이 확장되는 숲을 구현한 공간입니다. 빛과 음향이 어우러지며 관람객은 신비로운 세계 속을 거니는 듯한 몰입감을 경험합니다. 다섯 달이 차례로 떠오르고 마침내 하나로 모이는 ‘하슬라 문라이트 쇼’가 펼쳐집니다.',
    direction: [
      '목 — 푸른 달빛이 숲을 적시며 사슴과 산맥이 모습을 드러낸다.',
      '화 — 태양과 달이 교차하며 붉은 불꽃이 피어오른다.',
      '토 — 불길의 재가 황토가 되어 새로운 씨앗이 움튼다.',
      '금 — 흙 속에서 태어난 보석이 별이 되어 밤하늘을 물들인다.',
      '수 — 별빛 사이 구름이 몰려와 빗방울이 숲을 적신다.',
      '만월 — 다섯 빛이 하나로 모여 천문도의 무늬를 새긴다.',
    ],
    media: ['대형 LED WALL (7.4m)', 'LED 바', '조명기 일체', '포그머신', '사운드 시스템'],
    element: UI.ko.elementEarth,
  },
  zone7: {
    title: '달의 잔상',
    subtitle: '원형 데크 위에서 펼쳐지는 다섯 달의 세계',
    tagline:
      '원형 데크 위에 떠오른 찬란한 달빛, 발 밑에서 펼쳐지는 또 하나의 신비로운 세계',
    story:
      '관람객이 하슬라의 달빛과 그 세계를 걸으며 숲의 기억과 교감하는 인터랙티브 원형 공간입니다.',
    description:
      '원형 데크에 프로젝션 맵핑을 적용한 몰입형 인터랙션 공간. 중앙의 달은 조명쇼 각 테마와 연동되어 변화하고, 바닥에는 달의 세계가 투사됩니다. 관람객의 움직임에 반응해 파도와 균열, 빛의 파편이 피어나며 — 마치 사라진 달의 기억 속을 걷는 듯한 잔상의 세계를 마주하게 됩니다.',
    direction: [
      '원형 데크 중앙에 떠오른 달과 주변 세계가 시시각각 변주.',
      '관람객의 발걸음에 맞춰 빛의 파편과 파동이 피어나는 몰입형 연출.',
      '달을 중심으로 풍경이 은은하게 흐르고, 잔상처럼 부드러운 이펙트가 겹쳐져 여운을 남기는 서정적 연출.',
    ],
    media: ['빔 프로젝터 2EA', '프로젝션 맵핑 시스템', '위치 감지 센서', '사운드 시스템'],
    element: UI.ko.elementFire,
  },
  zone8: {
    title: '빛의 파동',
    subtitle: '달의 에너지가 숲길을 따라 흐르는 순간',
    tagline: '바닥 위에 흘러내리는 빛의 파동',
    story:
      '달빛의 에너지가 숲 바닥을 타고 물결치듯 흘러, 고대 하슬라의 숲을 깨어나게 합니다.',
    description:
      '송림 바닥에 달의 에너지가 흐르는 듯한 분위기를 조성하는 고보 조명 연출 공간. 바닥에 고보 패턴을 투사해 신비로운 달빛의 파동이 송림 바닥을 따라 흘러갑니다. 한 걸음 내딛을 때마다 달의 파동이 바닥에서 울려 퍼지고 — 관람객은 빛과 함께 걷는 특별한 경험을 하게 됩니다.',
    direction: [
      '바닥 고보 조명을 통해 달빛이 물결처럼 번지며 숲길 전체에 파동을 형성.',
      '달빛의 파동이 바닥을 따라 이어지며 관람객의 이동 경로를 자연스럽게 안내하는 동선 유도형 연출.',
    ],
    media: ['고보 라이팅', '사운드 시스템'],
    element: UI.ko.elementWood,
  },
}

const en: Record<string, LocalizedZone> = {
  zone1: {
    title: 'Hasla Portal',
    subtitle: 'A passage opened by moonlight',
    tagline: 'A moon-shaped gateway leading into a mystical world.',
    story:
      "One of the gateways into the forest of ancient Hasla — a moon-shaped passage opened by moonlight.",
    description:
      'Set among the pines, this circular portal is the threshold into the world of Hasla — the place where its myths begin. Step through, and a realm of fantasy unfolds before you.',
    direction: [
      'Visitors pass through a moon-shaped gate, crossing from the real forest into the mythic world of Hasla.',
      'A ring-shaped portal of light and fog evokes the sensation of stepping into ancient Hasla.',
    ],
    media: ['Line lighting', 'Circular entrance structure', 'Fog machine'],
    element: UI.en.elementWater,
  },
  zone2: {
    title: 'Breath of the Stumps',
    subtitle: 'Stumps awakening, pulsing with light',
    tagline: "Each stump answers a visitor's touch — light and harmony awakening the forest's life.",
    story:
      "In ancient Hasla, drawn by moonlight energy, every living thing once sang freely. Lay a hand on a stump and it pulses awake with light, layering harmonies that celebrate the forest's return.",
    description:
      "Moonlight seeps in, and the Hasla forest breathes again. Stumps that hold ancient memory respond with song; tap them, and waves of light and sound ripple outward — the forest's pulse coming alive. Through participation, visitors experience life itself awakening.",
    direction: [
      'Each object (stumps, ponds) responds interactively, letting visitors experience the moment of awakening directly.',
      "Lighting and sound sync to each tap; light radiates outward like the forest's pulse.",
    ],
    media: ['Stump models', 'Line lighting', 'Interaction sensors', 'Speakers'],
    element: UI.en.elementWood,
  },
  zone3: {
    title: 'Mirror Pond',
    subtitle: 'The pond of Hasla, restored by moonlight',
    tagline: 'On the moonlit pond, the life of Hasla appears — and stirs as you approach.',
    story:
      'A secret spring beneath the moon, where mystical lives — fish of light — gather. Step closer, and the pond of old Hasla is restored before your eyes.',
    description:
      'Moonlight and creatures are projected onto the mirrored surface; ripples, lights, and beings respond as you draw near. Follow the fleeing fish of light and walk through time on a pond bathed in moonlight.',
    direction: [
      "Smart mirrors display Hasla's fish swimming across their surface.",
      'Interaction sensors send the fish fleeing as visitors approach.',
    ],
    media: ['Smart mirror', 'Mirror panels', 'Interaction sensors', 'Speakers'],
    element: UI.en.elementWater,
  },
  zone4: {
    title: 'Five Moons',
    subtitle: 'The Great Stump — heart of the Hasla forest',
    tagline: "The world's largest pine stump, catching five streams of moonlight from the night sky.",
    story:
      'The heart of the Hasla forest — grown to colossal size by the concentrated light of five moons.',
    description:
      "Where the greatest pine of Hasla once stood. From the giant stump, five vertical beams rise to signify the five moons. Searchlights announce the rebirth of slumbering Hasla as the mystical moonlight radiates across the forest — the primal energy that sustains all of Hasla's ecology.",
    direction: [
      "Searchlights highlight Hasla's signature concept — the Five Moons.",
      'Five moons rise high, conveying the symbolic core of the Hasla world.',
    ],
    media: ['Searchlights', 'Giant stump structure', 'Sound system'],
    element: UI.en.elementEarth,
  },
  zone5: {
    title: 'Portrait of the Moon',
    subtitle: 'Mirror walls — the moon caught in reflection',
    tagline: 'A mystical chamber where you meet the moon through its reflection.',
    story:
      "Because moonlight was the source of the Hasla forest, people could meet the moon only through its reflection in this mirror — and many made their wishes there.",
    description:
      "A transitional space before the light show. Walking between zigzag mirror walls, visitors meet themselves bathed in moonlight alongside the moon's afterimage — a moment when self and moon become one. It also doubles as a nightscape photo spot.",
    direction: [
      'Zigzag mirror walls block the view and guide the path.',
      'Reflected moonlight lets visitors come face to face with the moon.',
    ],
    media: ['Mirror walls'],
    element: UI.en.elementFire,
  },
  zone6: {
    title: 'Infinity Forest',
    subtitle: 'Window of moonlight — a festival of light',
    tagline: 'An immersive 8m LED wall presenting the Moonlight Show — five moons rising one by one.',
    story:
      "An experiential stage where moonlight, forest, music, and light merge to recreate the mystical world of ancient Hasla — a vast portal onto the realm of five moons, a window into the sky's hidden lights.",
    description:
      'A roughly 8m LED wall set among the pines transforms the forest into an endless expanse. Light and sound combine in an immersive walk through a mystical world. Five moons rise one by one, finally uniting in the climactic Hasla Moonlight Show.',
    direction: [
      'Wood — Blue moonlight bathes the forest as deer and mountain ranges appear.',
      'Fire — Sun and moon cross paths and red flames rise.',
      'Earth — Embers turn to ochre soil and new seeds sprout.',
      'Metal — Gems born in the earth ascend to the sky as stars.',
      'Water — Clouds sweep through starlight and rain falls upon the forest.',
      'Full Moon — Five lights merge into one and etch a star-chart pattern across the sky.',
    ],
    media: ['Large LED wall (7.4m)', 'LED bars', 'Full lighting rig', 'Fog machines', 'Sound system'],
    element: UI.en.elementEarth,
  },
  zone7: {
    title: 'Afterimage of the Moon',
    subtitle: 'The world of five moons, unfolding on a circular deck',
    tagline: 'Brilliant moonlight on a circular deck — another mystical world unfolding beneath your feet.',
    story:
      "An interactive circular space where visitors walk through Hasla's moonlight and commune with the memory of the forest.",
    description:
      "An immersive interactive space with projection mapping on a circular deck. The central moon shifts in tune with each theme of the light show, while the moon's world is cast across the floor. Movement triggers waves, fissures, and light fragments — as if walking through the lingering memory of a vanished moon.",
    direction: [
      'The central moon and the world around it shift moment by moment.',
      'Light fragments and ripples bloom in response to footsteps.',
      'A lyrical scene flows around the moon, with soft afterimage effects layering into a quiet resonance.',
    ],
    media: ['Beam projector × 2', 'Projection mapping system', 'Position sensors', 'Sound system'],
    element: UI.en.elementFire,
  },
  zone8: {
    title: 'Wave of Light',
    subtitle: 'The moment moonlight flows along the forest path',
    tagline: 'Waves of light pouring across the ground.',
    story:
      "Moonlight energy flows across the forest floor in waves, awakening the ancient forest of Hasla.",
    description:
      "Gobo lighting makes the moon's energy seem to flow along the pine forest floor. Mystical waves of moonlight ripple across the ground; with every step, the moon's pulse echoes — and visitors walk in step with the light itself.",
    direction: [
      'Gobo lighting spreads moonlight in ripples that form waves across the path.',
      'The waves of moonlight guide visitors gently along the route.',
    ],
    media: ['Gobo lighting', 'Sound system'],
    element: UI.en.elementWood,
  },
}

export const ZONES_I18N: Record<Lang, Record<string, LocalizedZone>> = { ko, en }

export function localizeZone(id: string, lang: Lang): LocalizedZone | undefined {
  return ZONES_I18N[lang][id]
}
