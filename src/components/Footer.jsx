import { useLocation, useNavigate } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { useSound, EqBars } from './MusicToggle.jsx'

export default function Footer() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { playing, toggle } = useSound()

  const goTo = (id) => (e) => {
    e.preventDefault()
    if (pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="contact" className="border-t-2 border-ink bg-paper px-5 pb-10 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-6">
            ( 04 ) — Correspondence
          </p>
          <h2 className="font-display text-[11vw] md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight">
            Let&apos;s make<br />
            <span className="italic font-light">something good.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <p className="max-w-md text-ink-soft leading-relaxed">
            I&apos;m currently open to new opportunities and collaborations. My inbox is always
            open — whether you have a question, a project, or just want to say hi.
          </p>
          <a
            href="mailto:yemann2k39@gmail.com"
            className="link-line mt-6 inline-block font-display text-xl md:text-2xl italic"
          >
            yemann2k39@gmail.com
          </a>
        </Reveal>

        <div className="mt-14 md:mt-20 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.16em]">
            <a href="mailto:yemann2k39@gmail.com" className="link-line">Email</a>
            <a href="https://github.com/yemann2k39-jpg" target="_blank" rel="noreferrer" className="link-line">GitHub</a>
            <a href="https://linkedin.com/in/yemannkyaw" target="_blank" rel="noreferrer" className="link-line">LinkedIn</a>
            <button
              onClick={toggle}
              aria-pressed={playing}
              className={`flex items-center gap-2 transition-colors ${
                playing ? 'text-accent' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <EqBars on={playing} />
              Sound — {playing ? 'on' : 'off'}
            </button>
          </div>
          <p className="font-mono text-[10px] text-ink-soft">
            © {new Date().getFullYear()} Ye Mann Kyaw · Set in Fraunces &amp; Archivo · Built with React &amp; Vite
          </p>
        </div>
      </div>
    </footer>
  )
}
