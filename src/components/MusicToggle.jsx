import { createContext, useContext, useEffect, useRef, useState } from 'react'

const TRACK = 'music/lux-fall-mood.mp3' // swap this file to change the music

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
    // only fetch the track when the visitor actually plays it
    audio.preload = 'none'
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

// Music-note glyph with gentle waves when playing, muted slash when off.
export function EqBars({ on }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={on ? 'note-on' : ''}
      aria-hidden="true"
    >
      {/* note head + stem */}
      <circle cx="9" cy="18" r="2.4" fill="currentColor" stroke="none" />
      <path d="M11.4 18V6.5" />
      {/* sound waves */}
      {on ? (
        <>
          <path d="M15 9.5a5 5 0 0 1 0 5" className="note-wave" />
          <path d="M17.8 7.2a9 9 0 0 1 0 9.6" className="note-wave note-wave-2" />
        </>
      ) : (
        <path d="M4 4l16 16" className="note-mute" />
      )}
    </svg>
  )
}
