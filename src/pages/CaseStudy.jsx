import { useEffect, useRef, useState } from 'react'
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

function PhoneFrame({ src, alt, className = '', onClick }) {
  return (
    <div className={`phone ${className}`} onClick={onClick}>
      <div className="phone-screen">
        <div className="phone-cam"><i /></div>
        <img src={src} alt={alt} loading="lazy" draggable={false} className="min-h-0 w-full flex-1 object-cover" />
      </div>
    </div>
  )
}

function PhoneTrio({ imgs }) {
  return (
    <div className="phones-stage w-full">
      <PhoneFrame src={imgs[1]} className="side" alt="screen left" />
      <PhoneFrame src={imgs[0]} className="middle" alt="screen front" />
      <PhoneFrame src={imgs[2]} className="side" alt="screen right" />
    </div>
  )
}

/* Auto-rotating phone: pass an array of srcs to slide between screens.
   The frame stays mounted; only the screen image crossfades. */
const ROTATE_MS = 3200

function MediaBars({ count, idx, onPick, inside = true }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${inside ? 'bottom-3' : '-bottom-5'} z-10 flex items-center justify-center gap-2`}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          aria-label={`Slide ${i + 1}`}
          onClick={(e) => { e.stopPropagation(); onPick(i) }}
          className={`pointer-events-auto h-1.5 w-7 rounded-full border border-black/60 transition-colors ${i === idx ? 'bg-accent' : 'bg-white'}`}
        />
      ))}
    </div>
  )
}

/* stacked screens, opacity-only crossfade, auto-rotate; lazy-mount outer slides */
function useRotator(len, resetKey) {
  const [idx, setIdx] = useState(0)
  useEffect(() => { setIdx(0) }, [resetKey])
  useEffect(() => {
    if (len < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % len), ROTATE_MS)
    return () => clearInterval(t)
  }, [len, resetKey])
  return [idx, setIdx]
}

const lazySkip = (i, idx) => i > 0 && i > idx + 1 && !(idx === 0 && i === 1)

function AutoPhone({ srcs, alt = 'screen', className = '' }) {
  const list = Array.isArray(srcs) ? srcs : [srcs]
  // stable key of current slides — array identity changes every render
  const srcsKey = list.map((x) => (typeof x === 'string' ? x : x.src)).join('|')
  // resetKey: snap idx back to 0 whenever the slide list changes (tab switch),
  // otherwise a leftover idx > 0 leaves a single-slide tab stuck at opacity-0
  const [idx, setIdx] = useRotator(list.length, srcsKey)
  const vidRefs = useRef({})
  const [playing, setPlaying] = useState(false)
  const screenRef = useRef(null)

  // tab switch: stop the old video, rewind, restore the play button
  useEffect(() => {
    Object.values(vidRefs.current).forEach((el) => {
      if (!el) return
      el.pause()
      try { el.currentTime = 0 } catch { /* not seekable yet */ }
    })
    setPlaying(false)
  }, [idx, srcsKey])

  // scrolled fully out of view: stop and rewind
  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        Object.values(vidRefs.current).forEach((vid) => {
          if (!vid) return
          vid.pause()
          try { vid.currentTime = 0 } catch { /* not seekable yet */ }
        })
        setPlaying(false)
      }
    }, { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = (i) => {
    const el = vidRefs.current[i]
    if (!el) return
    if (el.paused) { el.play(); setPlaying(true) } else { el.pause(); setPlaying(false) }
  }
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen relative" ref={screenRef}>
        <div className="phone-cam"><i /></div>
        {list.map((it, i) => {
          const src = typeof it === 'string' ? it : it.src
          const v = typeof it !== 'string' && it.video
          const cls = `min-h-0 w-full h-full object-cover bg-[#14120e] transition-opacity duration-[450ms] ${i === idx ? 'opacity-100' : 'opacity-0'}`
          const load = lazySkip(i, idx)
          return v ? (
            <div key={src} className={`transition-opacity duration-[450ms] ${i === idx ? 'opacity-100' : 'opacity-0'} ${(typeof it !== 'string' && it.cover) ? 'absolute inset-0 flex items-center justify-center bg-[#14120e]' : ''}`} style={(typeof it !== 'string' && it.cover) ? undefined : (i === 0 ? { position: 'relative' } : { position: 'absolute', top: 0, left: 0, width: '100%' })}>
              <video
                ref={(el) => { vidRefs.current[i] = el; if (el) el.muted = true }}
                src={src}
                muted
                playsInline
                preload={v ? 'auto' : (load ? 'none' : 'metadata')}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                onClick={() => toggle(i)}
                className={(typeof it !== 'string' && it.cover) ? 'w-full object-cover bg-[#14120e]' : 'block w-full h-auto bg-[#14120e]'} style={(typeof it !== 'string' && it.cover) ? { aspectRatio: '1032 / 2102' } : undefined}
              />
              {!playing && (
                <button
                  aria-label="Play video"
                  onClick={() => toggle(i)}
                  className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-[#14120e] transition-transform hover:scale-105"
                >
                  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true">
                    <polygon points="6,3 17,10 6,17" fill="#f5f1e8" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <img
              key={src}
              src={src}
              alt={`${alt} ${i + 1}`}
              loading={load ? 'lazy' : 'eager'}
              draggable={false}
              className={cls}
              style={i === 0 ? { position: 'relative' } : { position: 'absolute', inset: 0 }}
            />
          )
        })}
        {list.length > 1 && <MediaBars count={list.length} idx={idx} onPick={setIdx} />}
      </div>
    </div>
  )
}
/* web-layout media: string | {src, fit} | {src, video} */
// keep the main-page carousel in sync with the project you navigate to
function rememberProject(slug) {
  const i = caseStudies.findIndex((c) => c.slug === slug)
  if (i >= 0) sessionStorage.setItem('portfolio:lastProject', String(i))
}

function FeatureMedia({ items, alt = 'feature', onOpen, preview = false }) {
  const list = Array.isArray(items) ? items : [items]
  const many = list.length > 1
  const [idx, setIdx] = useRotator(list.length)
  const item = list[idx] ?? list[0]
  const src = typeof item === 'string' ? item : item.src
  const isVideo = typeof item !== 'string' && item.video
  const zoomable = (!many || preview)

  return (
    <div className="relative">
      <figure
        className={`plate overflow-hidden ${zoomable ? 'cursor-zoom-in' : ''}`}
        onClick={zoomable ? () => onOpen?.(src, `${alt} · slide ${idx + 1} of ${list.length}`, many ? { list: list.map((x) => (typeof x === 'string' ? x : x.src)), idx, video: isVideo } : { video: isVideo }) : undefined}
      >
        {list.map((it, i) => {
          const s = typeof it === 'string' ? it : it.src
          const v = typeof it !== 'string' && it.video
          const containWhite = typeof it !== 'string' && it.fit === 'contain-white'
          if (v) {
            return (
              <video
                key={s}
                src={s}
                ref={(el) => { if (el) el.muted = true }}
                muted
                autoPlay
                playsInline
                className={`aspect-[16/9] w-full bg-plate object-contain transition-opacity duration-[450ms] ${i === idx ? 'opacity-100' : 'opacity-0'}`}
                style={i === 0 ? { position: 'relative' } : { position: 'absolute', inset: 0 }}
                preload={lazySkip(i, idx) ? 'none' : 'auto'}
              />
            )
          }
          return (
            <img
              key={s}
              src={s}
              alt={`${alt} ${i + 1}`}
              loading={lazySkip(i, idx) ? 'lazy' : 'eager'}
              className={`aspect-[16/9] w-full ${containWhite ? 'bg-white object-contain' : 'object-cover object-top'} transition-opacity duration-[450ms] ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              style={i === 0 ? { position: 'relative' } : { position: 'absolute', inset: 0 }}
            />
          )
        })}
        {many && <MediaBars count={list.length} idx={idx} onPick={setIdx} />}
      </figure>
    </div>
  )
}

/* numbered reflection list — gated by study.learnListStyle === 'numbered' */

/* MOBILE LAYOUT — phones LEFT, title & description RIGHT, then
   01 Why · 02 Core features · 03 Interactive preview · 04 Demo ·
   05 How · 06 What I learned · closing */
function MobileLayout({ study, prev, next }) {
  const features = (study.features ?? []).slice(0, 5)
  const challenges = (study.challenges ?? study.deepDive?.challenges ?? []).slice(0, 4)
  const videoFeature = features.find((f) => f.video) ?? features[0]

  // mobile: core-features swipe carousel — active dot follows scroll position
  const fgridRef = useRef(null)
  const [fdot, setFdot] = useState(0)
  const fgridStep = () => {
    const el = fgridRef.current
    if (!el || !el.firstChild) return 1
    return el.firstChild.getBoundingClientRect().width + 28
  }
  const onFgridScroll = () => {
    const el = fgridRef.current
    if (!el) return
    setFdot(Math.min(features.length - 1, Math.max(0, Math.round(el.scrollLeft / fgridStep()))))
  }
  const goToFdot = (i) => {
    const el = fgridRef.current
    if (el) el.scrollTo({ left: i * fgridStep(), behavior: 'smooth' })
  }

  const [tab, setTab] = useState(0)
  const tabFeature = features[tab] ?? features[0]
  const previewTabs = study.preview ?? features

  return (
    <div className="mx-auto px-5 pt-20 md:px-8" style={{ width: 'min(90%, 1400px)' }}>
      {/* detail-top — back link LEFT, project number RIGHT, thin strip between two lines */}
      <div className="dtop">
        <Link to="/" state={{ scrollTo: 'work' }} className="back group">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←&nbsp;&nbsp;</span>
          Selected projects
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          Project / {study.num}
        </span>
      </div>

      {/* detail-hero — title & description LEFT, phone trio RIGHT */}
      <section className="dhero">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-light italic tracking-tight leading-[1.05]">
            {study.title}
            <span className="text-accent not-italic font-semibold">.</span>
          </h1>
          {study.subtitle && (
            <p className="mt-3 font-display text-xl md:text-2xl font-light tracking-tight leading-snug text-ink">
              {study.subtitle}
            </p>
          )}
          <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-ink-soft">
            {study.description ?? study.standfirst}
          </p>
          <div className="chips mt-5">
            {study.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
              >
                Visit live site ↗
              </a>
            )}
            {study.githubUrl && (
              <a
                href={study.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                GitHub ↗
              </a>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
              Built end-to-end · {study.year}
            </span>
          </div>
        </div>

        <div className="phones-stage w-full">
          <PhoneFrame src={(study.phones ?? features.map((f) => f.img))[1]} className="side" alt="screen left" />
          <PhoneFrame src={(study.phones ?? features.map((f) => f.img))[0]} className="middle" alt="screen front" />
          <PhoneFrame src={(study.phones ?? features.map((f) => f.img))[2]} className="side" alt="screen right" />
        </div>
      </section>

      {/* 01 / WHY I BUILT IT */}
      <section className="dsec">
        <div className="eyebrow">01 / Origin</div>
        <div>
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Platform — {study.mobile ? 'Mobile' : 'Web'} &nbsp;·&nbsp; Year — {study.year}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium tracking-tight">
              Why I built it<span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
              {study.motivation}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 / THE EXPERIENCE — core features as phone gallery cards */}
      {features.length > 0 && (
        <section className="dsec">
          <div className="eyebrow">02 / The experience</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Core features<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <div ref={fgridRef} onScroll={onFgridScroll} className="fgrid mt-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: (i % 2) * 0.06 }}
                  className={`fcard ${['lil-routine', 'minipay'].includes(study.slug) ? 'fcard-sq' : ''}`}
                >
                  <AutoPhone srcs={f.img} className="feat" />
                  <div>
                    <h3 className="font-display text-xl font-medium tracking-tight">{f.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="fgrid-dots">
              {features.map((f, i) => (
                <button
                  key={f.title}
                  aria-label={`Go to ${f.title}`}
                  onClick={() => goToFdot(i)}
                  className={`fdot ${i === fdot ? 'on' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 03 / INTERACTIVE PREVIEW */}
      {features.length > 1 && (
        <section className="dsec">
          <div className="eyebrow">03 / Preview</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Explore the app<span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
                Click the tabs to switch between the real screens of the app.
              </p>
            </Reveal>
            <motion.div {...rise} className={`ipanel mt-8 ${['lil-routine', 'minipay'].includes(study.slug) ? 'ipanel-sq' : ''} ${['minipay', 'lil-routine'].includes(study.slug) ? 'pv-big' : ''}`}>
              <div>
                <span className="eyebrow">Live preview</span>
                <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  {previewTabs[tab].title}
                </h3>
                <p className="mt-3 h-[66px] md:h-[78px] text-sm md:text-base leading-relaxed text-ink-soft">
                  {previewTabs[tab].text}
                </p>
                {/* desktop: tabs in the text column (mobile shows them below the phone) */}
                <div className="tabs tabs-desktop mt-12">
                  {previewTabs.map((f, i) => (
                    <button
                      key={f.title}
                      onClick={() => setTab(i)}
                      className={`tab-btn ${i === tab ? 'on' : ''}`}
                    >
                      {f.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mx-auto w-full max-w-[282px] pv-phone">
                <AutoPhone
                  srcs={tab === 0 && study.slug === 'lil-routine' ? ['/images/lil-routine/lilroutine.jpg'] : previewTabs[tab].img}
                />
              </div>
              {/* mobile: tab buttons below the phone */}
              <div className="tabs tabs-mobile mt-12 justify-center">
                {previewTabs.map((f, i) => (
                  <button
                    key={f.title}
                    onClick={() => setTab(i)}
                    className={`tab-btn ${i === tab ? 'on' : ''}`}
                  >
                    {f.title}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 04 / DEMO VIDEO — portrait in a frame */}
      {!['minipay', 'lil-routine'].includes(study.slug) && (
      <section className="dsec">
        <div className="eyebrow">04 / Demo video</div>
        <div>
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
              A portrait video belongs in a frame<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              Record a focused 30–60 second walkthrough: open the app, complete a task, view the
              result. The placeholder below keeps its vertical space until your video is ready.
            </p>
          </Reveal>
          <div className="vgrid mt-8">
            <motion.div
              {...rise}
              className={`demo-box flex items-center justify-center border border-line rounded-[28px] bg-plate ${['lil-routine', 'minipay'].includes(study.slug) ? 'demo-box-sq' : ''}`}
            >
              <div className="relative">
                <PhoneFrame src={videoFeature.img} alt="Demo walkthrough placeholder" className="demo" />
                <span className="pointer-events-none absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-xl text-paper shadow-xl">
                  ▶
                </span>
              </div>
            </motion.div>
            <div>
              <span className="eyebrow">Walkthrough / sample</span>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">
                One short flow, not every screen.
              </h3>
              <ol className="mt-4 space-y-2.5">
                {features.slice(0, 3).map((f, i) => (
                  <li key={f.title} className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-accent">{i + 1}.</span>
                    <span className="text-sm md:text-base text-ink-soft">{f.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/70">
                Replace the placeholder with your portrait video — the frame stays.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 04 / HOW IT WORKS */}
      <section className="dsec">
        <div className="eyebrow">04 / Under the hood</div>
        <div>
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
              How it works<span className="text-accent">.</span>
            </h2>
          </Reveal>
          {study.how?.length > 0 ? (
            <div className="howgrid mt-8">
              {study.how.map((h, i) => {
                const [head, ...rest] = h.split(': ')
                return (
                  <motion.div key={i} {...rise} transition={{ ...rise.transition, delay: i * 0.04 }} className="hbox">
                    <b>{head}</b>
                    <span>{rest.join(': ')}</span>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flowd mt-8">
              {(study.flow ?? []).map((f, i) => (
                <motion.div
                  key={f.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: i * 0.06 }}
                  className="fcardx"
                >
                  <b>{f.title}</b>
                  <small>{f.sub}</small>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 05 / ENGINEERING DECISIONS + REFLECTION */}
      {challenges.length > 0 && (
        <section className="dsec">
          <div className="eyebrow">05 / Engineering decisions</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Decisions that mattered<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <div className="chcards mt-8">
              {challenges.map((c, i) => (
                <motion.div key={c.title} {...rise} transition={{ ...rise.transition, delay: i * 0.06 }} className="chcard">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  {c.note && <small className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Trade-off: {c.note}</small>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06 / QUALITY */}
      {study.testing && (
        <section className="dsec">
          <div className="eyebrow">06 / Quality</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Testing &amp; verification<span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-ink-soft">
                {study.testing}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* 07 / REFLECTION */}
      {study.learn && (
        <section className="dsec">
          <div className="eyebrow">07 / Reflection</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                What I learned<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              {study.learnList?.length > 0 ? (
                <ol className="mt-6 max-w-3xl">
                  {study.learnList.map((x, i) => (
                    <li
                      key={x}
                      className={`grid grid-cols-[44px_1fr] items-baseline gap-4 border-line py-4 ${i > 0 ? 'border-t' : ''}`}
                    >
                      <span className="numeral-hollow font-display text-xl font-bold">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base md:text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">{x}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
                  {study.learn}
                </p>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* 08 / WHAT'S NEXT */}
      {(study.limits?.length > 0 || study.next?.length > 0) && (
        <section className="dsec">
          <div className="eyebrow">08 / What&apos;s next</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Limitations &amp; next steps<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                {study.limits?.length > 0 && (
                  <div>
                    <h4 className="font-display text-xl font-medium tracking-tight text-ink">Current limitations</h4>
                    <ul className="mt-4 space-y-3">
                      {study.limits.map((x) => (
                        <li key={x} className="text-sm md:text-base leading-relaxed text-ink-soft underline decoration-line underline-offset-[12px] [text-wrap:pretty]">
                          <span className="font-mono text-accent">/ </span>{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {study.next?.length > 0 && (
                  <div>
                    <h4 className="font-display text-xl font-medium tracking-tight text-ink">On the roadmap</h4>
                    <ul className="mt-4 space-y-3">
                      {study.next.map((x) => (
                        <li key={x} className="text-sm md:text-base leading-relaxed text-ink-soft underline decoration-line underline-offset-[12px] [text-wrap:pretty]">
                          <span className="font-mono text-accent">/ </span>{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* closing — prev / back / next side by side */}
      <nav className="mt-10 mb-10 grid grid-cols-3 gap-4 border-t border-line pt-6 md:mb-14">
        <Link to={`/work/${prev.slug}`} state={{ slide: 'right' }} onClick={() => rememberProject(prev.slug)} className="group">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            ← Previous project
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
        <Link to="/" state={{ scrollTo: 'work' }} className="group text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            ← Back to all projects
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            All projects
          </span>
        </Link>
        <Link to={`/work/${next.slug}`} state={{ slide: 'left' }} onClick={() => rememberProject(next.slug)} className="group text-right">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            Next project →
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   WEB LAYOUT — for website projects (Sus · PC Shop)
═══════════════════════════════════════════════════════════ */
function WebLayout({ study, prev, next, onOpen }) {
  const features = (study.features ?? []).slice(0, 5)
  const challenges = (study.challenges ?? []).slice(0, 3)
  const notes = study.architecture?.points ?? []
  const allStack = (study.stack ?? []).flatMap((g) => g.items)

  const host = (() => {
    try { return study.liveUrl ? new URL(study.liveUrl).hostname : `${study.slug}.app` }
    catch { return `${study.slug}.app` }
  })()

  return (
    <>
      {/* hero — title & description LEFT, browser-framed photo RIGHT */}
      <section className="dhero whero">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-light italic tracking-tight leading-[1.05]">
            {study.title}
            <span className="text-accent not-italic font-semibold">.</span>
          </h1>
          {study.subtitle && (
            <p className="mt-3 font-display text-xl md:text-2xl font-light tracking-tight leading-snug text-ink">
              {study.subtitle}
            </p>
          )}
          <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-ink-soft">
            {study.description ?? study.standfirst}
          </p>
          <div className="chips mt-5">
            {study.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
              >
                Visit live site ↗
              </a>
            )}
            {study.githubUrl && (
              <a
                href={study.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                GitHub ↗
              </a>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
              Built end-to-end · {study.year}
            </span>
          </div>
        </div>

        <motion.div {...rise}>
          <figure className="browser overflow-hidden">
            <div className="browser-bar">
              <span className="bdots"><i /><i /><i /></span>
              <span className="burl">🔒&nbsp;&nbsp;{host}</span>
              <span className="bmenu">⋯</span>
            </div>
            <img
              src={study.cover}
              alt={`${study.title} cover`}
              className="aspect-[3/2] w-full bg-[#fffdf8] object-contain p-2"
            />
          </figure>
        </motion.div>
      </section>

      {/* 01 / WHY I BUILT IT */}
      <section className="srow">
        <div className="eyebrow">01 / Origin</div>
        <div>
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Platform — Web &nbsp;·&nbsp; Year — {study.year}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium tracking-tight">
              Why I built it<span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
              {study.motivation}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 / KEY FEATURES — big stacked images */}
      {features.length > 0 && (
        <section className="srow">
          <div className="eyebrow">02 / Key features</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Key features<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-16">
              {features.map((f, i) => (
                <motion.article key={f.title} {...rise} whileHover={{ y: -4 }} className="group">
                  <FeatureMedia items={f.img} alt={f.title} onOpen={onOpen} preview={study.slug === 'pc-shop' || study.slug === 'sus-url-shortener'} />
                  <h3 className="mt-4 font-display text-xl md:text-2xl font-medium tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm md:text-base leading-relaxed text-ink-soft">
                    {f.text}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 04 / UNDER THE HOOD */}
      {(study.flow?.length > 0 || notes.length > 0) && (
        <section className="srow">
          <div className="eyebrow">03 / Under the hood</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                How it works<span className="text-accent">.</span>
              </h2>
            </Reveal>
            {study.how?.length > 0 ? (
              <div className="howgrid mt-8">
                {study.how.map((h, i) => {
                  const [head, ...rest] = h.split(': ')
                  return (
                    <motion.div key={i} {...rise} transition={{ ...rise.transition, delay: i * 0.04 }} className="hbox">
                      <b>{head}</b>
                      <span>{rest.join(': ')}</span>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              study.flow?.length > 0 && (
                <div className="flowd mt-8">
                  {study.flow.map((f, i) => (
                    <motion.div
                      key={f.title}
                      {...rise}
                      transition={{ ...rise.transition, delay: i * 0.06 }}
                      className="fcardx"
                    >
                      <b>{f.title}</b>
                      <small>{f.sub}</small>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* 05 / ENGINEERING DECISIONS */}
      {challenges.length > 0 && (
        <section className="srow">
          <div className="eyebrow">04 / Engineering decisions</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Decisions that mattered<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="w-full md:w-[calc(50%-16px)] border border-line bg-paper-deep/40 p-6"
                >
                  <h3 className="font-display text-lg font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.text}</p>
                  {c.note && (
                    <small className="mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      Trade-off: {c.note}
                    </small>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 05 / QUALITY */}
      {study.testing && (
        <section className="srow">
          <div className="eyebrow">05 / Quality</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Testing &amp; verification<span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
                {study.testing}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* 06 / REFLECTION */}
      {study.learn && (
        <section className="srow">
          <div className="eyebrow">06 / Reflection</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                What I learned<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              {study.learnList?.length > 0 ? (
                study.learnListStyle === 'numbered' ? (
                  <ol className="mt-6 max-w-3xl">
                    {study.learnList.map((x, i) => (
                      <li
                        key={x}
                        className={`grid grid-cols-[44px_1fr] items-baseline gap-4 border-line py-4 ${i > 0 ? 'border-t' : ''}`}
                      >
                        <span className="numeral-hollow font-display text-xl font-bold">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-base md:text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">{x}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="mt-5 max-w-3xl space-y-3">
                    {study.learnList.map((x) => (
                      <li key={x} className="text-base md:text-lg leading-relaxed text-ink-soft underline decoration-line underline-offset-[12px] [text-wrap:pretty]">
                        <span className="font-mono text-[12px] text-accent">/ </span>{x}
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
                  {study.learn}
                </p>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* 07 / WHAT'S NEXT */}
      {(study.limits?.length > 0 || study.next?.length > 0) && (
        <section className="srow">
          <div className="eyebrow">07 / What&apos;s next</div>
          <div>
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                Limitations &amp; next steps<span className="text-accent">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                {study.limits?.length > 0 && (
                  <div>
                    <h4 className="font-display text-xl font-medium tracking-tight text-ink">Current limitations</h4>
                    <ul className="mt-4 space-y-3">
                      {study.limits.map((x) => (
                        <li key={x} className="text-sm md:text-base leading-relaxed text-ink-soft underline decoration-line underline-offset-[12px] [text-wrap:pretty]">
                          <span className="font-mono text-accent">/ </span>{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {study.next?.length > 0 && (
                  <div>
                    <h4 className="font-display text-xl font-medium tracking-tight text-ink">On the roadmap</h4>
                    <ul className="mt-4 space-y-3">
                      {study.next.map((x) => (
                        <li key={x} className="text-sm md:text-base leading-relaxed text-ink-soft underline decoration-line underline-offset-[12px] [text-wrap:pretty]">
                          <span className="font-mono text-accent">/ </span>{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}


      {/* prev / next — always side by side */}
      <nav className="mt-10 mb-10 grid grid-cols-3 gap-4 border-t border-line pt-6 md:mb-14">
        <Link to={`/work/${prev.slug}`} state={{ slide: 'right' }} onClick={() => rememberProject(prev.slug)} className="group">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            ← Previous project
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
        <Link to="/" state={{ scrollTo: 'work' }} className="group text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            ← Back to all projects
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            All projects
          </span>
        </Link>
        <Link to={`/work/${next.slug}`} state={{ slide: 'left' }} onClick={() => rememberProject(next.slug)} className="group text-right">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-accent">
            Next project →
          </span>
          <span className="mt-0.5 block font-display text-base font-medium tracking-tight transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>
    </>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const study = caseStudies.find((c) => c.slug === slug) ?? caseStudies[0]
  const idx = caseStudies.indexOf(study)
  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(idx + 1) % caseStudies.length]

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  const [lightbox, setLightbox] = useState(null)
  useEffect(() => {
    const lock = !!lightbox
    document.body.style.overflow = lock ? 'hidden' : ''
    document.documentElement.style.overflow = lock ? 'hidden' : ''
    if (lock) window.__lenis?.stop(); else window.__lenis?.start()
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; window.__lenis?.start() }
  }, [lightbox])

  return (
    <motion.main {...page}>
      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      {study.mobile ? (
        <MobileLayout study={study} prev={prev} next={next} />
      ) : (
        <div className="mx-auto px-5 pt-20 md:px-8" style={{ width: 'min(90%, 1400px)' }}>
          {/* detail-top — same strip as mobile pages */}
          <div className="dtop">
            <Link to="/" state={{ scrollTo: 'work' }} className="back group">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←&nbsp;&nbsp;</span>
              Selected projects
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              Project / {study.num}
            </span>
          </div>

          <WebLayout
            study={study}
            prev={prev}
            next={next}
            onOpen={(src, cap, nav) => setLightbox({ src, caption: cap, nav })}
          />
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[95] flex cursor-zoom-out items-center justify-center bg-[#0d0b08]/95 p-4"
        >
          <figure className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            {lightbox.nav?.list?.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.nav.idx - 1 + lb.nav.list.length) % lb.nav.list.length, src: lb.nav.list[(lb.nav.idx - 1 + lb.nav.list.length) % lb.nav.list.length], caption: lb.caption.replace(/slide \d+ of \d+/, `slide ${((lb.nav.idx - 1 + lb.nav.list.length) % lb.nav.list.length) + 1} of ${lb.nav.list.length}`), nav: { ...lb.nav, idx: (lb.nav.idx - 1 + lb.nav.list.length) % lb.nav.list.length } }))}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ece6d9]/40 bg-[#0d0b08]/80 text-[#ece6d9] transition-colors hover:border-accent hover:bg-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><polygon points="14,3 5,10 14,17" fill="currentColor" /></svg>
                </button>
                <button
                  aria-label="Next image"
                  onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.nav.idx + 1) % lb.nav.list.length, src: lb.nav.list[(lb.nav.idx + 1) % lb.nav.list.length], caption: lb.caption.replace(/slide \d+ of \d+/, `slide ${((lb.nav.idx + 1) % lb.nav.list.length) + 1} of ${lb.nav.list.length}`), nav: { ...lb.nav, idx: (lb.nav.idx + 1) % lb.nav.list.length } }))}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ece6d9]/40 bg-[#0d0b08]/80 text-[#ece6d9] transition-colors hover:border-accent hover:bg-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><polygon points="6,3 15,10 6,17" fill="currentColor" /></svg>
                </button>
              </>
            )}
            {lightbox.nav?.video ? (
              <video src={lightbox.src} autoPlay muted loop playsInline onClick={(e) => { const el = e.currentTarget; if (el.paused) el.play(); else el.pause() }} className="max-h-[82vh] max-w-[82vw] w-auto border border-paper/20 bg-[#14120e]" />
            ) : (
              <img src={lightbox.src} alt={lightbox.caption} className="max-h-[82vh] max-w-[82vw] w-auto border border-paper/20 bg-paper" />
            )}
            <figcaption className="absolute -bottom-9 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#ece6d9]">
              {lightbox.caption} · click anywhere to close
            </figcaption>
          </figure>
        </div>
      )}
    </motion.main>
  )
}
