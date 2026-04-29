'use client'

import Link from 'next/link'
import { useLang } from '@/i18n/LanguageContext'
import FadeInSection from '@/components/zone/FadeInSection'
import PreOpenBanner from '@/components/PreOpenBanner'

const ko = {
  heroEyebrow: '강릉, 그보다 더 오래 전의 이름',
  heroTitle: '다시 깨어나는 숲, HASLA',
  s1Label: '빛의 근원',
  s1: [
    '아주 오래 전, 강릉을 부르던 이름은 하슬라(HASLA)였습니다.',
    "하슬라는 '해' — 낮의 태양이 아닌, 이 땅에서 시작된 모든 밝음의 근원입니다.",
    '낮 동안 뜨겁게 타오르던 빛은 밤이 되면 바다와 대지의 품에 잠기고, 수면 위로 다섯 개의 달이 되어 떠오릅니다.',
  ],
  s2Label: '다섯 개의 달이 뜨는 밤',
  s2: [
    '어떤 기록도 남아있지 않은 고대 하슬라에는, 숲이 살아 우리와 함께 숨 쉬고 노래하던 시절이 있었습니다.',
    '그곳에서는 동물과 식물, 인간의 경계가 흐려지고, 모든 존재가 하나의 선율로 이어졌습니다.',
    '달빛이 숲을 감싸 안으면 나무는 노래를 부르고, 연못은 기억을 비추며, 바위와 바람마저 울림이 되었습니다.',
  ],
  s3Label: '오행, 다섯 빛의 순환',
  s3Intro: '다섯 개의 달은 각각 오행 — 목·화·토·금·수의 힘을 품습니다.',
  s3Moons: [
    { name: 'EVERGREEN MOON', element: '목 (木)', desc: '푸른 달빛이 숲을 적시고, 사슴과 산맥이 모습을 드러냅니다.' },
    { name: 'SOLAR MOON',     element: '화 (火)', desc: '태양과 달이 교차하며 붉은 불꽃이 피어오릅니다.' },
    { name: 'AMBER MOON',     element: '토 (土)', desc: '불길의 재가 황토가 되어 새로운 씨앗이 움틉니다.' },
    { name: 'STARLIGHT MOON', element: '금 (金)', desc: '흙 속에서 태어난 보석이 별이 되어 밤하늘을 물들입니다.' },
    { name: 'CLOUD MOON',     element: '수 (水)', desc: '별빛 사이 구름이 몰려와, 빗방울이 숲을 적십니다.' },
  ],
  s3Outro:
    '다섯이 마침내 하나로 모여 천문도의 무늬를 새기는 신월(THE NEW MOON)이 떠오를 때, 잠들어 있던 숲이 깨어납니다.',
  s4Label: '숲의 합창에 발걸음을 더하세요',
  s4: [
    '작은 그루터기의 숨결에 귀 기울여 보세요.',
    '기억이 새겨진 연못 속 빛나는 잔상을 마주해 보세요.',
    '디딤돌 위에 발걸음을 올리면, 당신의 리듬이 숲의 합창에 더해집니다.',
    '달빛을 머금은 거대한 그루터기 앞에서, 숲이 깨어나는 순간을 목격해 보세요.',
  ],
  outro: [
    '이 숲은 더 이상 단순한 산책로가 아닙니다.',
    '모든 나무가 서로의 선율이 되어 겹치고 울리며,',
    '숲은 마침내 달빛의 힘으로 깨어나 — 당신의 마음을 비춥니다.',
  ],
  ctaLabel: '여덟 개의 자리를 둘러보러 가기',
}

const en = {
  heroEyebrow: 'Gangneung — and the older name long before',
  heroTitle: 'A Forest Awakening Again — HASLA',
  s1Label: 'The Source of Light',
  s1: [
    'Long ago, Gangneung was called HASLA.',
    'Hasla means "sun" — not the daytime star, but the very origin of all brightness that began on this land.',
    'The fire that burned hot through the day sinks into the sea and earth at night, and rises again as five moons across the water.',
  ],
  s2Label: 'A Night of Five Moons',
  s2: [
    'In a time no record remembers, ancient Hasla was a forest that breathed and sang with us.',
    'There, the boundaries between animal, plant, and human blurred — and every being was joined in a single melody.',
    'When the moonlight wrapped the forest, the trees sang, the ponds reflected memory, and even the rocks and wind became echoes.',
  ],
  s3Label: 'Five Elements, the Cycle of Light',
  s3Intro: 'Each of the five moons holds one of the Five Elements — Wood, Fire, Earth, Metal, Water.',
  s3Moons: [
    { name: 'EVERGREEN MOON', element: 'Wood', desc: 'Blue moonlight bathes the forest as deer and mountain ranges appear.' },
    { name: 'SOLAR MOON',     element: 'Fire', desc: 'Sun and moon cross paths, and red flames rise.' },
    { name: 'AMBER MOON',     element: 'Earth', desc: 'Embers turn to ochre soil, and new seeds sprout.' },
    { name: 'STARLIGHT MOON', element: 'Metal', desc: 'Gems born in the earth ascend to the sky as stars.' },
    { name: 'CLOUD MOON',     element: 'Water', desc: 'Clouds sweep through starlight, and rain falls upon the forest.' },
  ],
  s3Outro:
    'When the five finally gather as one — a New Moon etching a star-chart across the sky — the sleeping forest awakens.',
  s4Label: "Add Your Step to the Forest's Chorus",
  s4: [
    'Listen for the breath of a small stump.',
    'Meet the shimmering afterimage in a memory-marked pond.',
    "Step onto a stone, and your rhythm joins the forest's chorus.",
    'Stand before the giant stump bathed in moonlight, and witness the forest awakening.',
  ],
  outro: [
    'This forest is no longer just a path.',
    'Every tree becomes a melody for the others, layered and resonant —',
    'and the forest, awakened by moonlight, finally illuminates your heart.',
  ],
  ctaLabel: 'Visit the eight zones',
}

export default function AboutPage() {
  const { lang } = useLang()
  const c = lang === 'en' ? en : ko

  return (
    <main className="min-h-dvh bg-black pb-32 pt-2">
      <div className="mx-auto max-w-md px-6">
        <div className="mt-4">
          <PreOpenBanner />
        </div>

        {/* HERO */}
        <FadeInSection>
          <header className="mt-16 text-center">
            <p className="font-display text-[11px] tracking-[0.45em] text-hasla-yellow/80">
              {c.heroEyebrow}
            </p>
            <h1 className="mt-5 font-display text-[34px] font-medium leading-[1.2] text-white">
              {c.heroTitle}
            </h1>
          </header>
        </FadeInSection>

        {/* Section 1 */}
        <Section label={c.s1Label}>
          {c.s1.map((line, i) => (
            <FadeInSection key={i} delay={0.06 * i}>
              <p className="mb-5 last:mb-0 font-display text-[16px] leading-[1.95] text-white/85">
                {line}
              </p>
            </FadeInSection>
          ))}
        </Section>

        {/* Section 2 */}
        <Section label={c.s2Label}>
          {c.s2.map((line, i) => (
            <FadeInSection key={i} delay={0.06 * i}>
              <p className="mb-5 last:mb-0 font-display text-[16px] leading-[1.95] text-white/85">
                {line}
              </p>
            </FadeInSection>
          ))}
        </Section>

        {/* Section 3 — Five moons grid */}
        <Section label={c.s3Label}>
          <FadeInSection>
            <p className="mb-7 font-display text-[16px] leading-[1.95] text-white/85">
              {c.s3Intro}
            </p>
          </FadeInSection>
          <ul className="flex flex-col divide-y divide-white/10">
            {c.s3Moons.map((moon, i) => (
              <FadeInSection key={moon.name} delay={0.05 * i}>
                <li className="py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-[12.5px] tracking-[0.18em] text-white">
                      {moon.name}
                    </span>
                    <span className="font-display text-[10.5px] tracking-[0.32em] text-hasla-yellow/85">
                      {moon.element}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-white/65">
                    {moon.desc}
                  </p>
                </li>
              </FadeInSection>
            ))}
          </ul>
          <FadeInSection delay={0.1}>
            <p className="mt-7 font-display text-[16px] italic leading-[1.95] text-white/85">
              {c.s3Outro}
            </p>
          </FadeInSection>
        </Section>

        {/* Section 4 — invitation */}
        <Section label={c.s4Label}>
          {c.s4.map((line, i) => (
            <FadeInSection key={i} delay={0.06 * i}>
              <p className="mb-4 last:mb-0 font-display text-[16px] leading-[1.85] text-white/85">
                {line}
              </p>
            </FadeInSection>
          ))}
        </Section>

        {/* Outro — close in italic */}
        <section className="mt-20">
          {c.outro.map((line, i) => (
            <FadeInSection key={i} delay={0.08 * i}>
              <p className="mb-2 text-center font-display text-[17px] italic leading-[1.7] text-white/90">
                {line}
              </p>
            </FadeInSection>
          ))}
        </section>

        {/* CTA */}
        <FadeInSection delay={0.2}>
          <div className="mt-14 flex justify-center">
            <Link
              href="/map"
              className="hasla-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-[14px] font-medium text-black transition-transform active:scale-[0.98]"
            >
              {c.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeInSection>
      </div>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <FadeInSection>
        <div className="mb-5 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-hasla-yellow/60" />
          <span className="font-display text-[10.5px] tracking-[0.45em] text-hasla-yellow/85">
            {label}
          </span>
        </div>
      </FadeInSection>
      {children}
    </section>
  )
}
