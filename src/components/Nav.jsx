import { useLocation, useNavigate } from 'react-router-dom'
import { useSound, EqBars } from './MusicToggle.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const LINKS = [
  { id: 'work', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { playing, toggle } = useSound()

  const goTo = (id) => (e) => {
    e.preventDefault()
    if (pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 14
      if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.3 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <button
          onClick={() => {
            pathname !== '/' ? navigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="group flex items-baseline gap-2 text-left"
        >
          <span
            className="font-display text-2xl font-semibold italic tracking-tight"
            title="Ye Mann Kyaw — software engineer"
          >
            ymk<span className="text-accent">.</span>
          </span>
        </button>

        <nav className="flex items-center gap-4 md:gap-6">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#/${l.id}`}
              onClick={goTo(l.id)}
              className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-accent md:inline"
            >
              {l.label}
            </a>
          ))}
          {/* compact link set on small screens */}
          <a
            href="#/work"
            onClick={goTo('work')}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft md:hidden"
          >
            Work
          </a>
          <a
            href="#/contact"
            onClick={goTo('contact')}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft md:hidden"
          >
            Contact
          </a>

          {/* night edition toggle */}
          <ThemeToggle />

          {/* sound toggle — small icon button, lives in the nav bar */}
          <button
            onClick={toggle}
            aria-pressed={playing}
            aria-label={playing ? 'Mute background music' : 'Play background music'}
            title={playing ? 'Mute background music' : 'Play background music'}
            className={`flex items-center gap-1.5 border px-2.5 py-1.5 transition-colors ${
              playing
                ? 'border-accent text-accent'
                : 'border-line text-ink-soft hover:border-ink hover:text-ink'
            }`}
          >
            <EqBars on={playing} />
          </button>
        </nav>
      </div>
    </header>
  )
}
