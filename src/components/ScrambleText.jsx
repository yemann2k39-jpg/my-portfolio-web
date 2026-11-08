import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}=+*^?#________'

// Text that decodes character-by-character when it enters the viewport.
export default function ScrambleText({ text, className = '', speed = 28 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(text.replace(/\S/g, ' '))

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const total = text.length * 3 + 10
    const timer = setInterval(() => {
      frame++
      const settled = Math.floor(frame / 3)
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < settled) return ch
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      )
      if (frame >= total) {
        clearInterval(timer)
        setDisplay(text)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [inView, text, speed])

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', minWidth: '1ch' }}>
      {display}
    </span>
  )
}
