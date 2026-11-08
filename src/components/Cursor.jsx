import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom cursor: accent dot + trailing ring that expands over interactive
// elements. Desktop (fine pointer) only.
export default function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      setHovering(!!e.target.closest?.('a, button, input, [role="button"], [data-cursor]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.9 : 1, opacity: hovering ? 1 : 0.55 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
