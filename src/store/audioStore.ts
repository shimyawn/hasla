'use client'

import { create } from 'zustand'

let _audioElement: HTMLAudioElement | null = null

export function getAudioElement(): HTMLAudioElement {
  if (typeof window === 'undefined') {
    throw new Error('Audio element only available in browser')
  }
  if (!_audioElement) {
    _audioElement = new Audio()
    _audioElement.preload = 'metadata'
  }
  return _audioElement
}

interface AudioState {
  currentZoneId: string | null
  currentTitle: string | null
  isPlaying: boolean
  duration: number
  currentTime: number
  loadZone: (zoneId: string, audioUrl: string, title: string) => void
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setTime: (t: number) => void
  setDuration: (d: number) => void
  setPlaying: (p: boolean) => void
  reset: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentZoneId: null,
  currentTitle: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  loadZone: (zoneId, audioUrl, title) => {
    if (typeof window === 'undefined') return
    const audio = getAudioElement()
    const isSameZone = get().currentZoneId === zoneId
    const isSameUrl = audio.src.endsWith(audioUrl)
    if (isSameZone && isSameUrl) return
    audio.pause()
    audio.src = audioUrl
    audio.load()
    set({ currentZoneId: zoneId, currentTitle: title, isPlaying: false, currentTime: 0, duration: 0 })
  },
  play: () => {
    if (typeof window === 'undefined') return
    const audio = getAudioElement()
    audio.play().catch(() => {})
  },
  pause: () => {
    if (typeof window === 'undefined') return
    const audio = getAudioElement()
    audio.pause()
  },
  toggle: () => {
    if (typeof window === 'undefined') return
    const audio = getAudioElement()
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  },
  seek: (time) => {
    if (typeof window === 'undefined') return
    const audio = getAudioElement()
    if (Number.isFinite(time)) audio.currentTime = time
  },
  setTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setPlaying: (p) => set({ isPlaying: p }),
  reset: () => set({ currentZoneId: null, currentTitle: null, isPlaying: false, duration: 0, currentTime: 0 }),
}))
