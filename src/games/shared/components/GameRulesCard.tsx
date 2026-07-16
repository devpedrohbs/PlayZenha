import { useEffect, useId, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Lightbulb, X } from 'lucide-react'
import { createPortal } from 'react-dom'

export interface GameRules {
  gameName: string
  summary: string
  rules: string[]
  tip: string
  accent?: string
  triggerLabel?: string
}

const GameRulesCard = ({
  gameName,
  summary,
  rules,
  tip,
  accent = '#0441F2',
  triggerLabel = 'Ver regras antes de jogar'
}: GameRules) => {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const descriptionId = useId()
  const accentStyle = { '--rules-accent': accent } as CSSProperties

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <>
      <button
        className="playzenha-rules-trigger"
        type="button"
        style={accentStyle}
        onClick={() => setOpen(true)}
      >
        <BookOpen aria-hidden="true" />
        {triggerLabel}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="playzenha-rules-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={() => setOpen(false)}
            >
              <motion.article
                className="playzenha-rules-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                style={accentStyle}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <header className="playzenha-rules-header">
                  <span className="playzenha-rules-icon"><BookOpen aria-hidden="true" /></span>
                  <div>
                    <p>Como jogar</p>
                    <h2 id={titleId}>{gameName}</h2>
                  </div>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Fechar regras">
                    <X aria-hidden="true" />
                  </button>
                </header>

                <p className="playzenha-rules-summary" id={descriptionId}>{summary}</p>

                <ol className="playzenha-rules-list">
                  {rules.map((rule, index) => (
                    <li key={rule}>
                      <span>{index + 1}</span>
                      <p>{rule}</p>
                    </li>
                  ))}
                </ol>

                <div className="playzenha-rules-tip">
                  <Lightbulb aria-hidden="true" />
                  <p><strong>Dica de resenha</strong>{tip}</p>
                </div>

                <button className="playzenha-rules-confirm" type="button" onClick={() => setOpen(false)}>
                  <CheckCircle2 aria-hidden="true" />
                  Entendi, vamos jogar
                </button>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default GameRulesCard
