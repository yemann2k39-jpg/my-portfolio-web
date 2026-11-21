// Mikko — portfolio chatbot. Floating bubble, bottom-right. Simple version:
// panel with message list + input, history kept client-side, replies stream
// in as plain text (no markdown rendering yet).
import { useEffect, useRef, useState } from 'react'

const OPENER =
  "Hi, I'm Mikko. Ask me anything about Ye Mann Kyaw: his projects, skills or experience."

// Render Mikko's replies with simple structure: line breaks, "- " bullets,
// and **bold**. User messages stay plain.
function RichText({ text }) {
  const lines = String(text).split('\n')
  return lines.map((line, i) => {
    const bullet = /^[-•]\s+/.test(line)
    const content = line.replace(/^[-•]\s+/, '')
    const parts = content.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    const inner = parts.map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={j} className="font-semibold">{p.slice(2, -2)}</strong>
        : p
    )
    return bullet ? (
      <div key={i} className="flex gap-1.5">
        <span className="text-accent shrink-0">•</span>
        <span>{inner}</span>
      </div>
    ) : (
      <div key={i} className={i > 0 ? 'mt-1' : ''}>{inner}</div>
    )
  })
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // { role: 'user' | 'assistant', text }
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  // greeting tip: shown once on page load so visitors know the bubble is a chatbot
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, busy])

  const send = async () => {
    const text = input.trim()
    if (!text || busy) return
    const history = [...messages, { role: 'user', text }]
    setMessages(history)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      setMessages([...history, { role: 'assistant', text: (data.reply || '…').split('—').join(', ') }])
    } catch {
      setMessages([...history, { role: 'assistant', text: 'Connection problem, please try again.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[130] flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex h-[480px] w-[340px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl"
          role="dialog"
          aria-label="Chat with Mikko"
        >
          {/* header */}
          <div className="flex items-center gap-2.5 border-b border-line bg-paper-deep/40 px-4 py-3">
            <img src="mikko.png" alt="Mikko" className="h-8 w-8 rounded-full object-cover border border-line" />
            <div className="flex-1">
              <div className="font-display text-sm font-medium tracking-tight">Mikko</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">
                portfolio assistant
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-ink-soft transition-colors hover:text-accent"
            >
              ✕
            </button>
          </div>

          {/* messages */}
          <div ref={listRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
            <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-line bg-paper-deep/40 px-3 py-2 text-sm leading-relaxed text-ink">
              {OPENER}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-ink px-3 py-2 text-sm leading-relaxed text-paper'
                    : 'max-w-[85%] rounded-xl rounded-tl-sm border border-line bg-paper-deep/40 px-3 py-2 text-sm leading-relaxed text-ink'
                }
              >
                {m.role === 'assistant' ? <RichText text={m.text} /> : m.text}
              </div>
            ))}
            {busy && (
              <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-line bg-paper-deep/40 px-3 py-2 text-sm text-ink-soft">
                Mikko is typing…
              </div>
            )}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about Ye Mann's work…"
              className="flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="rounded-lg bg-accent px-3 py-2 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {open && showTip && setShowTip(false)}
      {!open && showTip && (
        <div className="max-w-[220px] rounded-xl rounded-br-sm border border-line bg-paper px-3 py-2 text-sm leading-snug text-ink shadow-lg">
          Hi, I'm Mikko, an AI assistant. Ask me anything about Ye Mann!
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Mikko'}
        className="flex items-center justify-center rounded-full border border-line bg-ink shadow-xl transition-transform hover:scale-105"
        style={{ height: 52, width: 52 }}
      >
        {open ? (
          <span className="text-lg text-paper">✕</span>
        ) : (
          <img src="mikko.png" alt="Mikko" className="h-[36px] w-[36px] rounded-full object-cover" />
        )}
      </button>
    </div>
  )
}
