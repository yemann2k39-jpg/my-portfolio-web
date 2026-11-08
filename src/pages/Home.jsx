import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Ticker from '../components/Ticker.jsx'
import SplitChars from '../components/SplitChars.jsx'
import { caseStudies, skills, about, approach } from '../data/content.js'

const page = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
}

/* ———————————————————————— COVER ———————————————————————— */
function Cover() {
  const scrollToWork = (e) => {
    e.preventDefault()
    const el = document.getElementById('work')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 14
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex-1 px-5 pt-36 md:px-8 md:pt-42">
      <div className="mx-auto max-w-6xl">
        {/* rubber stamp — top right */}
        <div
          className="absolute right-40 top-[154px] z-10 hidden select-none md:block"
          style={{ transform: 'rotate(-10deg) scale(1.15)' }}
        >
          <div className="border-2 border-accent p-1.5 opacity-85">
            <div className="border border-accent px-6 py-3 text-center">
              <p className="font-mono text-[13px] font-bold uppercase leading-relaxed tracking-[0.3em] text-accent">
                Open
                <br />
                to work
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-accent">★ 2026 ★</p>
            </div>
          </div>
        </div>

        {/* top left — name + role */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display font-semibold tracking-[-0.03em] leading-[0.92] text-[15.5vw] md:text-[7rem] lg:text-[8.5rem]"
        >
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <SplitChars text="Ye Mann" delay={0.2} />
          </span>
          <br />
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom font-light italic text-ink">
            <SplitChars text="Kyaw" delay={0.5} />
          </span>
          <span className="text-accent">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent"
        >
          — software engineer
        </motion.p>

        {/* rest — starts at page center, top aligned with the middle of “Kyaw” */}
        <div className="mt-12 flex justify-start md:absolute md:left-[56%] md:right-8 md:top-[290px] lg:top-[325px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md pt-8"
          >
            <p className="text-xl md:text-2xl leading-relaxed text-ink">
              I build software to explore ideas, solve technical challenges, and turn curiosity
              into working applications.
            </p>

            <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft">
              Singapore Polytechnic · Diploma in Information Technology (Graduated)
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                onClick={scrollToWork}
                className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
              >
                View Selected Projects ↓
              </a>
              <a
                href="resume.pdf"
                download
                className="border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                Download Resume ⤓
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { label: 'Email', url: 'mailto:yemann2k39@gmail.com' },
                { label: 'GitHub', url: 'https://github.com/yemann2k39-jpg' },
                { label: 'LinkedIn', url: 'https://linkedin.com/in/yemannkyaw' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="border border-line px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
/* ———————————————————————— FEATURED WORK (rotating ring) ————————————————————————
   All projects sit on a 3D circle around a central axis (top view: a ring).
   The active project faces you at the front; the two neighbours are rotated
   ±SLOT° around the ring — genuinely tilted in 3D, partially cut by the screen
   edge. Swiping rotates the whole ring; only 3 cards are ever visible. */

function Carousel() {
  const n = caseStudies.length
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [dragAngle, setDragAngle] = useState(0)
  const go = (d) => setIndex((index + d + n) % n)

  const active = caseStudies[index]

  // Ring geometry: LOGICAL slots are even (360°/6) so ordering always holds
  // (project 6 sits left of project 1), but the VISUAL tilt per slot is gentler.
  const SLOT = 360 / n // even ring: slot spacing adapts to project count
  const TILT = 30     // visual rotation per slot — gentle backward tilt
  const norm = (a) => ((a % 360) + 540) % 360 - 180

  // Ring size follows the stage width so proportions hold at every breakpoint.
  // Factor 0.87 calibrated against a real 27" screen: user measured 3.1cm (~100px)
  // gap at factor 0.94; −0.07 solves to ~33px ≈ 1cm.
  const stageRef = useRef(null)
  const [stageW, setStageW] = useState(0)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setStageW(el.clientWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const RADIUS = stageW ? stageW * 0.87 : 1002
  const PERSPECTIVE = RADIUS * 3

  // ——— drag-to-rotate, phone-style ———
  // The ring angle follows the finger 1:1; after 8px we capture the pointer so the
  // drag keeps working anywhere, while plain taps on visible cards still work.
  const pointerId = useRef(null)
  const startX = useRef(0)
  const pending = useRef(false)
  const tracking = useRef(false)
  const captured = useRef(false)
  const swiped = useRef(false)

  // full slot swap at ~250px of drag — visible live tracking while dragging
  const pxToDeg = (px) => px * (SLOT / 250)

  const onPointerDown = (e) => {
    pending.current = true
    pointerId.current = e.pointerId
    startX.current = e.clientX
  }
  const onPointerMove = (e) => {
    if (!pending.current) return
    const dx = e.clientX - startX.current
    if (!tracking.current && Math.abs(dx) > 8) {
      tracking.current = true
      if (stageRef.current?.setPointerCapture) {
        try {
          stageRef.current.setPointerCapture(e.pointerId)
          captured.current = true
        } catch { /* capture is best-effort */ }
      }
    }
    if (tracking.current) setDragAngle(pxToDeg(dx)) // ring follows the finger
  }
  const endDrag = (e) => {
    const wasTracking = tracking.current
    if (captured.current && stageRef.current?.releasePointerCapture && pointerId.current != null) {
      try { stageRef.current.releasePointerCapture(pointerId.current) } catch { /* ignore */ }
    }
    pending.current = false
    tracking.current = false
    captured.current = false
    pointerId.current = null
    setDragAngle(0) // ring snaps to the nearest slot
    const dx = wasTracking && e.clientX != null ? e.clientX - startX.current : 0
    if (Math.abs(dx) > 80) {
      swiped.current = true
      go(dx < 0 ? 1 : -1)
      setTimeout(() => { swiped.current = false }, 350)
    }
  }

  return (
    <div>
      {/* ——— glass panel: wraps image, title, description and controls ——— */}
      <div className="relative px-4 pt-10 pb-5 sm:px-8 sm:pt-12 sm:pb-6">
        {/* sized to the front card + ~1.5cm each side; top sits ~1cm above the image */}
        <div
          className="glass-stage"
          aria-hidden="true"
          style={
            stageW
              ? {
                  left: '50%',
                  top: 10,
                  bottom: 10,
                  transform: 'translateX(-50%)',
                  width: stageW * 0.72 + 114,
                }
              : { left: '8%', right: '8%', top: 12, bottom: 12 }
          }
        />

        {/* ——— stage ——— */}
        <div
          ref={stageRef}
          className="relative mx-auto aspect-[5/2] w-full select-none"
          style={{ perspective: `${PERSPECTIVE}px`, touchAction: 'pan-y' }}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {caseStudies.map((study, i) => {
          const angle = norm((i - index) * SLOT + dragAngle)
          const rot = (angle / SLOT) * TILT // gentle visual tilt, even slot ordering
          const visible = Math.abs(angle) < SLOT + 15 // front + both neighbours only
          const aRad = (rot * Math.PI) / 180
          return (
            <div
              key={study.slug}
              role="button"
              aria-label={`Show ${study.title}`}
              aria-current={Math.abs(angle) < 1}
              className={`absolute left-1/2 top-1/2 w-[43%] ${
                visible ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={{
                transform: `translate(-50%, -50%) rotateY(${rot}deg) translateZ(${RADIUS}px)`,
                zIndex: Math.max(1, Math.round(30 * Math.cos(aRad)) + 10),
                transition: tracking.current
                  ? 'none'
                  : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onClick={() => {
                if (swiped.current) return
                if (Math.abs(angle) < 1) navigate(`/work/${study.slug}`)
                else go(angle > 0 ? 1 : -1)
              }}
            >
              <figure className="plate overflow-hidden rounded-[22px]">
                <img
                  src={study.cover}
                  alt={`${study.title} cover plate`}
                  loading="lazy"
                  draggable={false}
                  className="aspect-[16/10] w-full object-cover object-top select-none"
                />
              </figure>
            </div>
          )
        })}
      </div>

      {/* ——— info under the image (active project only) ——— */}
      <div className="relative z-10 mx-auto mt-5 h-[210px] w-[55%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              <span>Plate {active.num}</span>
              <span>{active.year}</span>
            </div>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-medium tracking-tight">
              {active.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
              {active.standfirst}
            </p>
            <div className="mt-3.5 flex items-center justify-between gap-x-4">
              <ul className="flex flex-wrap gap-1.5">
                {active.tags.slice(0, 3).map((t) => (
                  <li
                    key={t}
                    className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <span className="flex shrink-0 items-center gap-4">
                <Link to={`/work/${active.slug}`} className="group/l font-display text-base italic">
                  <span className="link-line">View project</span>
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover/l:translate-x-1">→</span>
                </Link>
                {active.liveUrl && (
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/l font-display text-base italic"
                  >
                    <span className="link-line">Live</span>
                    <span className="ml-0.5">↗</span>
                  </a>
                )}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ——— controls ——— */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          ← Prev
        </button>
        <div className="flex items-center gap-2">
          {caseStudies.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-accent' : 'w-1.5 bg-line hover:bg-ink-soft'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          Next →
        </button>
      </div>
      </div>
    </div>
  )
}

function FeaturedWork({ scale }) {
  const innerRef = useRef(null)
  const [dim, setDim] = useState({ h: 0, fit: 1 })
  const kicker = `${caseStudies.length} projects`


  // §01 shrinks itself just enough to always fit one viewport —
  // the poster's global scale multiplies on top of this local fit.
  useEffect(() => {
    const measure = () => {
      const h = innerRef.current?.offsetHeight ?? 0
      if (!h) return
      const avail = window.innerHeight - 56 - 48 // nav + breathing room
      const fit = Math.min(1, Math.max(0.45, avail / (h * scale)))
      setDim({ h, fit })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (innerRef.current) ro.observe(innerRef.current)
    window.addEventListener('resize', measure)
    return () => ro.disconnect()
  }, [scale])

  return (
    <section id="work" className="relative px-5 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader num="01" title="Selected Projects" kicker={kicker} />
        <div style={{ height: dim.h * dim.fit || undefined }}>
          <div
            ref={innerRef}
            style={{ transform: `scale(${dim.fit})`, transformOrigin: 'top center' }}
            className="will-change-transform"
          >
            <Reveal>
              <Carousel scale={scale} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
/* ———————————————————————— SKILLS ———————————————————————— */
function Skills() {
  return (
    <section className="border-y border-line bg-paper-deep/50 px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader num="02" title="The Toolkit" kicker="Instruments of the trade" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {s.label}
              </h3>
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {s.items.map((item) => (
                  <li key={item} className="font-display text-lg leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ———————————————————————— ABOUT ———————————————————————— */
function About() {
  return (
    <section id="about" className="px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader num="03" title="About the Author" />
        <div className="grid items-start gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <figure className="plate p-3">
              <div className="overflow-hidden">
                <img
                  src={about.portrait}
                  alt="Portrait of Ye Mann Kyaw"
                  className="aspect-[4/5] w-full object-cover grayscale-[35%] transition-all duration-700 hover:grayscale-0"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                Fig. 01 — The author, at work.
              </figcaption>
            </figure>
          </Reveal>
          <div className="md:col-span-9">
            <Reveal>
              <h3 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-tight">
                {about.heading
                  .split(' ')
                  .map((w, i) => (i === 2 ? <em key={i} className="italic font-light">{w} </em> : <span key={i}>{w} </span>))}
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="dropcap mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {about.paragraphs[0]}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">{about.paragraphs[1]}</p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <blockquote className="mx-auto max-w-4xl border-y-2 border-ink py-10 text-center md:py-14">
            <p className="font-display text-2xl md:text-4xl font-light italic leading-snug tracking-tight">
              “{approach}”
            </p>
            <cite className="mt-6 block font-mono text-[11px] not-italic uppercase tracking-[0.2em] text-accent">
              — The working principle
            </cite>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

/* ———————————————————————— PAGE (poster canvas) ————————————————————————
   The whole page is a 1440px-wide canvas scaled uniformly to the viewport —
   like viewing the same image on different monitors. Height-capped so the
   first screen (canvas top 820px + nav) always fits. */
export default function Home() {
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [canvasH, setCanvasH] = useState(0)
  const [marginLeft, setMarginLeft] = useState(0)
  const [heroMinH, setHeroMinH] = useState(0)

  useEffect(() => {
    const measure = () => {
      // clientWidth = usable width (scrollbar excluded) — canvas never slips under it
      const s = Math.max(0.34, Math.min(document.documentElement.clientWidth / 1440, (window.innerHeight - 56) / 820))
      setScale(s)
      setMarginLeft(Math.max(0, (document.documentElement.clientWidth - 1440 * s) / 2))
      setHeroMinH((window.innerHeight - 56) / s)
      if (canvasRef.current) setCanvasH(canvasRef.current.offsetHeight * s)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (canvasRef.current) ro.observe(canvasRef.current)
    ro.observe(document.documentElement) // catches scrollbar appearing/disappearing
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div style={{ height: canvasH }}>
      <div
        ref={canvasRef}
        className="relative"
        style={{ width: 1440, marginLeft, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="flex h-[700px] flex-col" style={{ minHeight: heroMinH || undefined }}>
          <Cover />
          <div className="mt-auto pt-6 md:pt-10">
            <Ticker />
          </div>
        </div>

        <FeaturedWork scale={scale} />
        <Skills />
        <About />
      </div>
    </div>
  )
}
