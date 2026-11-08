import { motion, useScroll, useTransform, useVelocity } from 'framer-motion'

const ITEMS = [
  'FULL-STACK DEVELOPMENT',
  'Applied AI',
  'CREATIVE CODING',
  'CURIOUS BY NATURE',
  'ENGINEER BY PRACTICE',
  'software engineer',
]

// Thin editorial ticker under the cover — reacts to scroll velocity.
export default function Ticker() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewX = useTransform(velocity, [-2500, 0, 2500], [-7, 0, 7], { clamp: true })
  const drift = useTransform(velocity, [-2500, 0, 2500], [70, 0, -70], { clamp: true })

  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="overflow-hidden border-y border-line bg-paper-deep/60 py-3 select-none" aria-hidden="true">
      <motion.div style={{ skewX, x: drift }} className="will-change-transform">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center gap-8">
              {row.map((item, i) => (
                <span key={`${half}-${i}`} className="flex items-center gap-8">
                  <span className="font-mono text-[11px] tracking-[0.22em] text-ink-soft">{item}</span>
                  <span className="font-mono text-xs text-accent">{'</>'}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
