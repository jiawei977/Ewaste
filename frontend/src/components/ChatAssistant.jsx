import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../api'

const QUESTION_LIMIT = 30

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [remaining, setRemaining] = useState(QUESTION_LIMIT)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    apiRequest('/api/chat')
      .then((data) => setRemaining(data.remaining))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    function closeOnEscape(event) {
      if (event.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  function closeChat() {
    setOpen(false)
    setError('')
  }

  async function sendMessage(event) {
    event.preventDefault()
    const question = input.trim()
    if (!question || sending || remaining <= 0) return

    const previousMessages = messages
    setMessages((current) => [...current, { role: 'user', content: question }])
    setInput('')
    setError('')
    setSending(true)
    try {
      const data = await apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: question, history: previousMessages.slice(-10) }),
      })
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }])
      setRemaining(data.remaining)
    } catch (requestError) {
      setError(requestError.message)
      if (requestError.message.includes('30-question limit')) setRemaining(0)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`chat-assistant ${open ? 'is-open' : ''}`}>
      {open && (
        <aside className="chat-window" role="dialog" aria-label="E-Waste Assistant">
          <header className="chat-header">
            <span className="chat-header-icon"><i className="bi bi-robot" /></span>
            <div><strong>E-Waste Assistant</strong><small><i className="bi bi-circle-fill" /> Online</small></div>
            <button type="button" aria-label="Minimize chat" onClick={closeChat}><i className="bi bi-x-lg" /></button>
          </header>

          <div className="chat-messages" aria-live="polite">
            <div className="chat-welcome">
              <span><i className="bi bi-chat-heart-fill" /></span>
              <strong>How can I help?</strong>
              <p>Ask me about e-waste, safe disposal, recycling categories or how to use this app.</p>
            </div>
            {messages.map((message, index) => (
              <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === 'assistant' && <i className="bi bi-recycle" />}
                <p>{message.content}</p>
              </div>
            ))}
            {sending && <div className="chat-message assistant"><i className="bi bi-recycle" /><div className="chat-typing" aria-label="Assistant is typing"><span /><span /><span /></div></div>}
            {error && <div className="chat-error" role="alert"><i className="bi bi-exclamation-circle" /> {error}</div>}
            <div ref={endRef} />
          </div>

          <form className="chat-compose" onSubmit={sendMessage}>
            <div className="chat-limit"><span>{remaining} of {QUESTION_LIMIT} questions remaining</span><span>Clears when signed out</span></div>
            <div className="chat-input-row">
              <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) sendMessage(event) }} maxLength="500" rows="1" placeholder={remaining ? 'Ask an e-waste question…' : 'Question limit reached'} disabled={sending || remaining <= 0} aria-label="Chat message" />
              <button type="submit" disabled={!input.trim() || sending || remaining <= 0} aria-label="Send message"><i className="bi bi-send-fill" /></button>
            </div>
          </form>
        </aside>
      )}
      {!open && <button className="chat-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open E-Waste Assistant"><i className="bi bi-robot" /></button>}
    </div>
  )
}
