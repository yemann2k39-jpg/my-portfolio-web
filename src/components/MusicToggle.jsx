import { createContext, useContext, useEffect, useRef, useState } from 'react'

const TRACK = 'music/ambient-loop.wav' // swap this file to change the music

const SoundContext = createContext({ playing: false, toggle: () => {} })
export const useSound = () => useContext(SoundContext)

// One audio instance for the whole app; buttons anywhere can control it.
export function SoundProvider({ children }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(TRACK)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    // resume previous preference (browsers still require one interaction first)
    if (localStorage.getItem('portfolio-sound') === 'on') {
      audio.play().catch(() => {})
    }

    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
      localStorage.setItem('portfolio-sound', 'on')
    } else {
      audio.pause()
      localStorage.setItem('portfolio-sound', 'off')
    }
  }

  return <SoundContext.Provider value={{ playing, toggle }}>{children}</SoundContext.Provider>
}

// Tiny equalizer glyph, shared by the nav and footer buttons.
export function EqBars({ on }) {
  return (
    <span className={`flex h-3 items-end gap-[2.5px] ${on ? 'eq-on' : ''}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="eq-bar block w-[2.5px] bg-current" style={{ height: '100%' }} />
      ))}
    </span>
  )
}
