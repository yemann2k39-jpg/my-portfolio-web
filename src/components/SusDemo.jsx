import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Tiny Neal.fun-style toy: type anything, watch it get a "sus code".
// (A playful stand-in for the real Feistel permutation in the actual project.)
function makeSus(input) {
  let n = [...input].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 68719476736, 7) // 2^34 space
  for (let round = 0; round < 4; round++) {
    const left = n >> 17
    const right = n & 0x1ffff
    const mixed = (right * 2654435761 + round * 0x9e37) & 0x1ffff
    n = ((right << 17) | (left ^ mixed)) & 0x3ffffffff
  }
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += chars[n % 62]
    n = Math.floor(n / 62) + 7
  }
  return out
}

export default function SusDemo() {
  const [text, setText] = useState('')
  const code = useMemo(() => (text.trim() ? makeSus(text.trim()) : null), [text])

  return (
    <div className="mt-10 border border-line bg-paper-deep/60 px-4 py-3.5 md:px-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        Try it — make anything sus ✳
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={40}
          placeholder="type something…"
          className="w-48 border-b border-ink bg-transparent px-1 py-1 font-mono text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-accent"
        />
        <span className="font-mono text-sm text-ink-soft">→</span>
        <AnimatePresence mode="wait">
          {code ? (
            <motion.span
              key={code}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="border border-accent px-2.5 py-1 font-mono text-sm tracking-[0.25em] text-accent"
            >
              {code}
            </motion.span>
          ) : (
            <span className="font-mono text-sm text-ink-soft/60">??????</span>
          )}
        </AnimatePresence>
        <span className="ml-auto hidden font-mono text-[10px] text-ink-soft/70 sm:inline">
          like my sus-url-shortener — unique by construction
        </span>
      </div>
    </div>
  )
}
