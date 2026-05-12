/**
 * Long-form narrative copy for the /about page.
 *
 * Lives in its own module (mirroring src/i18n/zones.ts) so the page
 * component stays under ~100 lines and the translation team can update
 * tone/wording without diving into JSX. Each locale exports the same
 * shape so AboutPageClient can pick by `lang` and render uniformly.
 */
import type { Lang } from './types'

export interface AboutCopy {
  heroTitle: string
  body: string[]
  s3Label: string
  s3Intro: string
  s3Moons: { element: string; desc: string }[]
  s3Outro: string
  s4Label: string
  s4: string[]
  ctaLabel: string
}

const ko: AboutCopy = {
  heroTitle:
    '다섯 개의 달이 뜨는 밤,\n고대 하슬라의 판타지가 펼쳐집니다.',
  body: [
    '아주 먼 옛날, 강릉의 고대 땅 하슬라에는\n달이 지지 않고 하늘을 지키던 시절이 있었습니다.\n달은 물과 불, 나무와 별, 그리고 땅의 순환을 다스렸고,\n사람과 동물, 식물은 경계 없이 어울리며\n오색 빛으로 물든 숲에서 매일 춤을 추었습니다.',
    '그러던 어느 날, 달이 다섯 갈래로 조각나\n소나무 숲 속으로 내려앉았습니다.',
    '시간이 흐르며 고대 하슬라의 판타지는 잊혀져가고,\n숲을 지켜온 할아버지 나무들의 노래를 통해서만\n어린 나무들에게 비밀처럼 전해져 내려왔습니다.',
    '다섯 개의 달이 소나무 숲 위로 떠오르는 오늘,\n고대 하슬라의 빛나는 기억이 눈앞에 펼쳐집니다.',
  ],
  s3Label: '오행, 다섯 빛의 순환',
  s3Intro: '다섯 개의 달은 각각 오행 —\n목·화·토·금·수의 힘을 품습니다.',
  s3Moons: [
    { element: '목 (木)', desc: '푸른 달빛이 숲을 적시고, 숲과 동물들이 깨어납니다.' },
    { element: '화 (火)', desc: '태양과 달이 교차하며 붉은 불꽃이 피어오릅니다.' },
    { element: '토 (土)', desc: '불길의 재가 황토가 되어 새로운 씨앗이 움틉니다.' },
    { element: '금 (金)', desc: '흙 속에서 태어난 보석이 별이 되어 밤하늘을 물들입니다.' },
    { element: '수 (水)', desc: '별빛 사이 구름이 몰려와, 빗방울이 숲을 적십니다.' },
  ],
  s3Outro:
    '다섯이 마침내 하나로 모여 만월이 될 때, 잠들어 있던 숲이 완전히 깨어납니다.',
  s4Label: '숲에 발걸음을 더하세요',
  s4: [
    '작은 그루터기의 숨결에 귀 기울여 보세요.',
    '기억이 새겨진 연못 속 빛나는 잔상을 마주해 보세요.',
    '달빛을 머금은 거대한 그루터기 앞에서,\n숲이 깨어나는 순간을 목격해 보세요.',
  ],
  ctaLabel: '둘러보기',
}

const en: AboutCopy = {
  heroTitle:
    'On a night when five moons rise,\nthe fantasy of ancient Hasla unfolds.',
  body: [
    "Long ago, in Gangneung's ancient land of Hasla,\nthere was a time when the moon never set — watching over the sky.\nThe moon governed the cycles of water and fire,\ntree and star, and the earth itself.\nPeople, animals, and plants moved as one,\ndancing each day in a forest aglow with five colors of light.",
    'Then one day, the moon shattered into five fragments\nand drifted down into the pine forest.',
    'As time passed, the fantasy of ancient Hasla faded —\nkept alive only in the songs of the elder trees who watch over the forest,\nwhispered like a secret to the young saplings.',
    'Tonight, as five moons rise above the pines,\nthe shining memory of ancient Hasla unfolds before your eyes.',
  ],
  s3Label: 'Five Elements, the Cycle of Light',
  s3Intro:
    'Each of the five moons holds one of the Five Elements —\nWood, Fire, Earth, Metal, Water.',
  s3Moons: [
    { element: 'Wood', desc: 'Blue moonlight bathes the forest as the woods and animals awaken.' },
    { element: 'Fire', desc: 'Sun and moon cross paths, and red flames rise.' },
    { element: 'Earth', desc: 'Embers turn to ochre soil, and new seeds sprout.' },
    { element: 'Metal', desc: 'Gems born in the earth ascend to the sky as stars.' },
    { element: 'Water', desc: 'Clouds sweep through starlight, and rain falls upon the forest.' },
  ],
  s3Outro:
    'When the five finally unite as one full moon, the sleeping forest awakens at last.',
  s4Label: 'Add your step to the forest',
  s4: [
    'Listen for the breath of a small stump.',
    'Meet the shimmering afterimage in a pond that remembers.',
    'Stand before the giant stump bathed in moonlight,\nand witness the moment the forest awakens.',
  ],
  ctaLabel: 'Explore',
}

export const ABOUT_COPY: Record<Lang, AboutCopy> = { ko, en }
