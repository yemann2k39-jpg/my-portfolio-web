import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import BackToTop from './components/BackToTop.jsx'
import BackToProjects from './components/BackToProjects.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import { SoundProvider } from './components/MusicToggle.jsx'
import Grain from './components/Grain.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Home from './pages/Home.jsx'
// detail page is code-split: only fetched when a case study is opened
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'))

function ScrollManager({ ready }) {
  const { pathname, state } = useLocation()
  useEffect(() => {
    // wait until the curtain has covered and the new page is displayed —
    // otherwise the OLD page visibly jumps to the top before the animation
    if (!ready) return
    if (state?.scrollTo) {
      // the curtain transition delays the page mount — poll until the
      // target section actually exists, then scroll to it
      let tries = 0
      const t = setInterval(() => {
        const el = document.getElementById(state.scrollTo)
        if (el) {
          clearInterval(t)
          const top = el.getBoundingClientRect().top + window.scrollY - 14
          if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.3 })
          else el.scrollIntoView({ behavior: 'smooth' })
        } else if (++tries > 25) {
          clearInterval(t)
        }
      }, 100)
      return () => clearInterval(t)
    }
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname, state, ready])
  return null
}

// Directional sweep transition — a plain full-screen layer slides across
// (main→detail: sweeps DOWN; detail→main: sweeps UP), the page swaps behind
// it at full cover, then the layer keeps travelling out the far side. The
// old page itself never moves.
function Curtain({ phase, dir, onCovered, onDone }) {
  if (phase === 'idle') return null
  const covering = phase === 'covering'
  const h = dir === 'left' || dir === 'right'
  const axis = h ? 'x' : 'y'
  const enter = !h ? (dir === 'down' ? '-100%' : '100%') : dir === 'left' ? '100%' : '-100%'
  const exit = !h ? (dir === 'down' ? '100%' : '-100%') : dir === 'left' ? '-100%' : '100%'
  const layers = [
    { cls: 'bg-accent', delayCover: 0, delayLeave: 0.03, complete: false },
    { cls: 'bg-ink', delayCover: 0.05, delayLeave: 0, complete: true },
  ]
  return (
    <div className="sweep pointer-events-none fixed inset-0 z-[110]">
      {layers.map((l) => (
        <motion.div
          key={l.cls + phase}
          className={`absolute inset-0 ${l.cls}`}
          initial={{ [axis]: covering ? enter : '0%' }}
          animate={{ [axis]: covering ? '0%' : exit }}
          transition={{
            duration: 0.45,
            ease: [0.65, 0, 0.35, 1],
            delay: covering ? l.delayCover : l.delayLeave,
          }}
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
  const [dir, setDir] = useState('down')
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
    if (location.pathname !== display.pathname && phase === 'idle') {
      const toDetail = location.pathname.startsWith('/work/')
      const fromDetail = display.pathname.startsWith('/work/')
      // detail → detail (next/prev project): sweep left/right from the link
      setDir(fromDetail && toDetail ? location.state?.slide || 'left' : toDetail ? 'down' : 'up')
      setPhase('covering')
    }
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
        dir={dir}
        onCovered={() => {
          setDisplay(location)
          lenisRef.current?.scrollTo(0, { immediate: true })
          window.scrollTo(0, 0)
          setPhase('revealing')
        }}
        onDone={() => setPhase('idle')}
      />

      <Nav />
      <ScrollManager ready={location.pathname === display.pathname} />

      <Routes location={display} key={display.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<Suspense fallback={null}><CaseStudy /></Suspense>} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
      <BackToTop />
      <BackToProjects />
      <ChatWidget />
      </>
      )}
    </SoundProvider>
  )
}
