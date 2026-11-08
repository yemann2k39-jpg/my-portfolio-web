import { motion } from 'framer-motion'

// Letters rise out of an overflow mask, one by one — clean entrance for big type.
export default function SplitChars({ text, className = '', delay = 0, stagger = 0.035 }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className}`}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '115%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}
