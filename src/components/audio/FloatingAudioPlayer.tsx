'use client'

import { useEffect, useRef, useState } from 'react'
import { getAudioElement, useAudioStore } from '@/store/audioStore'
import { useLang } from '@/i18n/LanguageContext'

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function FloatingAudioPlayer() {
  const { currentZoneId, currentTitle, isPlaying, duration, currentTime, toggle, seek, setTime, setDuration, setPlaying } = useAudioStore()
  const { t } = useLang()
  const [error, setError] = useState(false)
  const wiredRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (wiredRef.current) return
    wiredRef.current = true
    const audio = getAudioElement()
    const onTime = () => setTime(audio.currentTime)
    const onDur = () => setDuration(audio.duration || 0)
    const onPlay = () => { setPlaying(true); setError(false) }
    const onPause = () => setPlaying(false)
    const onErr = () => setError(true)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDur)
    audio.addEventListener('durationchange', onDur)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onErr)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDur)
      audio.removeEventListener('durationchange', onDur)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onErr)
      audio.removeEventListener('ended', onEnded)
    }
  }, [setTime, setDuration, setPlaying])

  if (!currentZoneId) return null

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[420px]">
      <div className="rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isPlaying ? t.ariaPause : t.ariaPlay}
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD06A] via-[#FF8653] to-[#FF5184] text-black"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-white/90">{currentTitle ?? t.audioTitleDefault}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/55">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="flex-1 accent-[#FFD06A]"
                aria-label={t.ariaSeek}
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        {error && <div className="mt-2 text-[11px] text-[#FA5F5C]">{t.audioError}</div>}
        {!error && pct === 0 && !isPlaying && <div className="mt-2 text-[11px] text-white/45">{t.audioTapToPlay}</div>}
      </div>
    </div>
  )
}
