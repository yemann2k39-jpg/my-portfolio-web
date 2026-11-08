import { useEffect, useState } from 'react'

// Night Edition toggle — the site opens dark by default;
// switching to the Day Edition is remembered for next visit.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Switch to day edition' : 'Switch to night edition'}
      title={dark ? 'Day edition' : 'Night edition'}
      className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] leading-none transition-colors hover:border-accent hover:text-accent"
    >
      {dark ? '☀ Day' : '☾ Night'}
    </button>
  )
}
