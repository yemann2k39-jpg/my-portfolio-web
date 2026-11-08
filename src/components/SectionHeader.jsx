import Reveal from './Reveal.jsx'
import ScrambleText from './ScrambleText.jsx'

// Chapter opener: "( 01 ) — Selected Work" with a rule that runs to the edge.
export default function SectionHeader({ num, title, kicker }) {
  return (
    <Reveal className="border-t border-ink pt-4 mb-8 md:mb-10">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="font-mono text-xs md:text-sm text-accent">( {num} )</span>
        <h2 className="font-display text-2xl md:text-4xl font-medium tracking-tight">
          <ScrambleText text={title} />
        </h2>
        {kicker && (
          <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-ink-soft ml-auto">
            {kicker}
          </span>
        )}
      </div>
    </Reveal>
  )
}
