import type { ReactNode } from 'react'

interface SectionHeadProps {
  eyebrow: string
  title: string
  children: ReactNode
}

export const SectionHead = ({ eyebrow, title, children }: SectionHeadProps) => (
  <div className="landing-section-head">
    <div>
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
    <p>{children}</p>
  </div>
)
