import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import { SoundProvider } from './components/MusicToggle.jsx'
import Grain from './components/Grain.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'

function ScrollManager() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (state?.scrollTo) {
      const t = setTimeout(() => {
        const el = document.getElementById(state.scrollTo)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - 14
        if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.3 })
        else el.scrollIntoView({ behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(t)
    }
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname, state])
  return null
}

// Center-out transition — ONE movement: the panel grows from the middle of
// the screen to cover it, the page swaps behind it, then the panel simply
// dissolves in place. No slide, no second motion.
function Curtain({ phase, onCovered, onDone }) {
  if (phase === 'idle') return null
  const covering = phase === 'covering'
  const layers = [
    { cls: 'bg-accent', delayCover: 0, delayFade: 0.05, complete: false },
    { cls: 'bg-ink', delayCover: 0.09, delayFade: 0, complete: true },
  ]
  return (
    <div className="pointer-events-none fixed inset-0 z-[110]">
      {layers.map((l) => (
        <motion.div
          key={l.cls + phase}
          className={`absolute inset-0 ${l.cls}`}
          initial={covering ? { scaleY: 0, opacity: 1 } : { scaleY: 1, opacity: 1 }}
          animate={covering ? { scaleY: 1, opacity: 1 } : { scaleY: 1, opacity: 0 }}
          transition={{
            duration: covering ? 0.55 : 0.4,
            ease: covering ? [0.76, 0, 0.24, 1] : 'easeOut',
            delay: covering ? l.delayCover : l.delayFade,
          }}
          style={{ transformOrigin: 'center' }}
          onAnimationComplete={l.complete ? (covering ? onCovered : onDone) : undefined}
        />
      ))}
    </div>
  )
}
// First-visit preloader: ink screen, counter runs, curtain lifts.
function Preloader({ done }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(100, c + Math.ceil(Math.random() * 8) + 2)
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(done, 300)
        }
        return next
      })
    }, 48)
    return () => clearInterval(timer)
  }, [done])

  return (
    <motion.div
      key="preloader"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink text-paper"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50">
        Ye Mann Kyaw — portfolio
      </p>
      <div className="mt-5 font-display text-7xl font-semibold md:text-8xl">{count}</div>
      <div className="mt-6 h-px w-52 overflow-hidden bg-paper/20">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${count}%` }} />
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
        setting the type…
      </p>
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const [display, setDisplay] = useState(location)
  const [phase, setPhase] = useState('idle')
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef(null)

  // buttery inertia scrolling, exposed for anchor navigation
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisRef.current = lenis
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // route change → curtain sweeps in
  useEffect(() => {
    if (location.pathname !== display.pathname && phase === 'idle') setPhase('covering')
  }, [location, display, phase])


  return (
    <SoundProvider>
      <Cursor />
      <Grain />

      <AnimatePresence>{!loaded && <Preloader done={() => setLoaded(true)} />}</AnimatePresence>

      {!loaded ? null : (
      <>
      <Curtain
        phase={loaded ? phase : 'idle'}
        onCovered={() => {
          setDisplay(location)
          lenisRef.current?.scrollTo(0, { immediate: true })
          window.scrollTo(0, 0)
          setPhase('revealing')
        }}
        onDone={() => setPhase('idle')}
      />

      <Nav />
      <ScrollManager />

      <Routes location={display} key={display.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
      </>
      )}
    </SoundProvider>
  )
}
