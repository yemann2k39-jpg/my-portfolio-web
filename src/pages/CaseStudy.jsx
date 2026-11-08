import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { caseStudies } from '../data/content.js'

const page = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
}

const rise = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

// Chaptered section: "§01 — Title" with a rule.
function Section({ num, title, note, children }) {
  return (
    <section className="mt-16 md:mt-24">
      <motion.div {...rise} className="flex items-baseline justify-between border-t border-ink pt-3">
        <h2 className="font-display text-2xl md:text-4xl font-medium tracking-tight">
          <span className="font-mono text-xs md:text-sm text-accent mr-3">§{num}</span>
          {title}
        </h2>
        {note && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">{note}</span>
        )}
      </motion.div>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function FeatureCard({ f, i, onOpen }) {
  return (
    <motion.article
      {...rise}
      transition={{ ...rise.transition, delay: (i % 2) * 0.08 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <figure
        className={`plate relative overflow-hidden ${f.video ? '' : 'cursor-zoom-in'}`}
        onClick={f.video ? undefined : () => onOpen(f.img, f.title)}
      >
        <img
          src={f.img}
          alt={f.title}
          loading="lazy"
          draggable={false}
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {f.video && (
          <>
            <span className="absolute left-3 top-3 border border-paper/40 bg-ink/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper">
              Video placeholder
            </span>
            <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-paper shadow-lg transition-transform duration-300 group-hover:scale-110">
              ▶
            </span>
          </>
        )}
      </figure>
      <h3 className="mt-3 font-display text-lg font-medium tracking-tight">{f.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.text}</p>
    </motion.article>
  )
}

// Phone feature: portrait screen inside a device frame — for mobile apps.
function PhoneFeature({ f, i, onOpen }) {
  return (
    <motion.article
      {...rise}
      transition={{ ...rise.transition, delay: (i % 4) * 0.07 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <figure
        className={`relative overflow-hidden rounded-[42px] border-2 border-ink bg-ink p-1.5 shadow-[0_18px_40px_-18px_rgba(28,26,22,0.45)] ${
          f.video ? '' : 'cursor-zoom-in'
        }`}
        onClick={f.video ? undefined : () => onOpen(f.img, f.title)}
      >
        <img
          src={f.img}
          alt={f.title}
          loading="lazy"
          draggable={false}
          className="aspect-[9/19] w-full rounded-[34px] object-cover object-top"
        />
        {f.video && (
          <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/90 text-paper shadow-lg transition-transform duration-300 group-hover:scale-110">
            ▶
          </span>
        )}
      </figure>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        {String(i + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-1 font-display text-base font-medium tracking-tight">{f.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{f.text}</p>
    </motion.article>
  )
}

function Lightbox({ src, caption, onClose }) {
  if (!src) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] flex cursor-zoom-out items-center justify-center bg-ink/90 p-6"
    >
      <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={caption} className="max-h-[80vh] w-auto border border-paper/20 bg-paper" />
        <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70">
          {caption} · click anywhere to close
        </figcaption>
      </figure>
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const study = caseStudies.find((c) => c.slug === slug) ?? caseStudies[0]
  const idx = caseStudies.indexOf(study)
  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(idx + 1) % caseStudies.length]
  const [lightbox, setLightbox] = useState(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  const features = (study.features ?? []).slice(0, 4)
  const challenges = (study.challenges ?? []).slice(0, 2)
  const notes = study.architecture?.points ?? []
  const allStack = (study.stack ?? []).flatMap((g) => g.items)

  return (
    <motion.main {...page}>
      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <div className="px-5 pt-24 md:px-8 md:pt-28">
        <div className="mx-auto max-w-5xl pb-16 md:pb-24">
          {/* ——— back link ——— */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-accent"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All projects
          </Link>

          {/* ——— masthead ——— */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 border-b-2 border-ink pb-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {study.title} — {study.year}
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05]">
              {study.title}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-base md:text-lg font-light italic leading-snug text-ink-soft">
              {study.standfirst}
            </p>
            <div className="mt-6 grid gap-x-8 gap-y-2 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft sm:grid-cols-2 md:grid-cols-4">
              <span><span className="text-accent">Role —</span> {study.role}</span>
              <span><span className="text-accent">Year —</span> {study.year}</span>
              <span>
                {study.liveUrl ? (
                  <a href={study.liveUrl} target="_blank" rel="noreferrer" className="link-line hover:text-accent">
                    Live site ↗
                  </a>
                ) : (
                  <span className="text-accent">Status —</span>
                )}
                {study.liveUrl ? '' : ' personal project'}
              </span>
              <span><span className="text-accent">Type —</span> {study.tags[0]}</span>
            </div>
          </motion.header>

          {/* ——— hero visual ——— */}
          <Reveal className="mt-10">
            <figure className="plate overflow-hidden">
              <img
                src={study.cover}
                alt={`${study.title} cover`}
                className="aspect-[16/8] w-full object-cover object-top"
              />
            </figure>
          </Reveal>

          {/* ——— §01 Overview ——— */}
          <Section num="01" title="Overview" note="what & why">
            <motion.div {...rise} className="grid gap-8 md:grid-cols-12">
              <p className="dropcap text-base md:text-lg leading-relaxed text-ink-soft md:col-span-7">
                {study.overview}
              </p>
              <div className="md:col-span-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Built with
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {allStack.slice(0, 12).map((chip) => (
                    <li
                      key={chip}
                      className="border border-line px-2 py-0.5 font-mono text-[10px] text-ink-soft"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </Section>

          {/* ——— §02 Key Features ——— */}
          {features.length > 0 && (
            <Section
              num="02"
              title="Key Features"
              note={study.mobile ? 'mobile app — phone frames' : `${features.length} highlights`}
            >
              {study.mobile ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
                  {features.map((f, i) => (
                    <PhoneFeature key={f.title} f={f} i={i} onOpen={(src, cap) => setLightbox({ src, caption: cap })} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <FeatureCard key={f.title} f={f} i={i} onOpen={(src, cap) => setLightbox({ src, caption: cap })} />
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* ——— §03 Engineering Notes ——— */}
          {notes.length > 0 && (
            <Section num="03" title="Engineering Notes" note="design decisions">
              <div className="space-y-0">
                {notes.map((p, i) => (
                  <motion.div
                    key={i}
                    {...rise}
                    transition={{ ...rise.transition, delay: i * 0.05 }}
                    className="grid gap-1 border-t border-line py-4 md:grid-cols-12 md:gap-6"
                  >
                    <span className="font-mono text-xs text-accent md:col-span-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm md:text-base leading-relaxed text-ink-soft md:col-span-11">{p}</p>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* ——— §04 Challenges ——— */}
          {challenges.length > 0 && (
            <Section num="04" title="Challenges" note="problems, solved">
              <div className="grid gap-8 md:grid-cols-2">
                {challenges.map((c, i) => (
                  <motion.div
                    key={c.title}
                    {...rise}
                    transition={{ ...rise.transition, delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="border border-line bg-paper-deep/40 p-6"
                  >
                    <span className="numeral-hollow font-display text-4xl font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-medium tracking-tight">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.text}</p>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* ——— §05 Verified + pipeline ——— */}
          {study.testing && (
            <Section num="05" title="Verified" note="quality">
              <motion.p {...rise} className="max-w-3xl text-sm md:text-base leading-relaxed text-ink-soft">
                {study.testing}
              </motion.p>
            </Section>
          )}

          {study.future?.length > 0 && (
            <Reveal className="mt-12">
              <section className="border-y-2 border-ink bg-paper-deep/60 px-6 py-8 md:px-10">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  In the pipeline
                </h2>
                <div className="mt-4 grid gap-6 md:grid-cols-3">
                  {study.future.map((f) => (
                    <div key={f.title}>
                      <h3 className="font-display text-base font-medium tracking-tight">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{f.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* ——— next project ——— */}
          <nav className="mt-14 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
            <Link to={`/work/${prev.slug}`} className="group">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">
                ← Previous project
              </span>
              <span className="mt-0.5 block font-display text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
            <Link to={`/work/${next.slug}`} className="group sm:text-right">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">
                Next project →
              </span>
              <span className="mt-0.5 block font-display text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          </nav>
        </div>
      </div>

      <Lightbox src={lightbox?.src} caption={lightbox?.caption} onClose={() => setLightbox(null)} />
    </motion.main>
  )
}
