import { USE_CASES } from '../../../pages/HomePage/model/constants'
import { LandingIcon, type LandingIconName } from './LandingIcon'
import { SectionHead } from './SectionHead'

export const UseCasesSection = () => (
  <section className="landing-section reveal">
    <SectionHead eyebrow="Feito para qualquer role" title="Quando junta gente, cabe Playzenha">
      A linguagem e os cenarios sao brasileiros, sociais e diretos. Nada de app serio demais para um momento que precisa ser leve.
    </SectionHead>
    <div className="landing-use-strip">
      {USE_CASES.map(({ icon, title }) => (
        <article className="landing-use-card" key={title}>
          <span className="landing-mini-icon"><LandingIcon name={icon as LandingIconName} /></span>
          <h3>{title}</h3>
        </article>
      ))}
    </div>
  </section>
)
