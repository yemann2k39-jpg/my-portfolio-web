import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Floating back button for detail pages. Mirrors BackToTop: appears after
// 600px of scrolling, top-left corner, same visual style.
// Same behavior as the "← Selected projects" link: home, scrolled to the
// Selected Projects section.
export default function BackToProjects() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!pathname.startsWith('/work/')) return null
  if (!show) return null

  return (
    <button
      onClick={() => navigate('/', { state: { scrollTo: 'work' } })}
      aria-label="Go back"
      title="Go back"
      className="fixed left-6 top-20 z-[90] flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink shadow-lg transition-colors hover:border-accent hover:text-accent"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  )
}
