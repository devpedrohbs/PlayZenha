import { PRICING_PLANS } from '../../pricing/plans'
import { SectionHead } from './SectionHead'

interface PricingSectionProps {
  onSignupClick: () => void
}

export const PricingSection = ({ onSignupClick }: PricingSectionProps) => (
  <section className="landing-section reveal" id="planos">
    <SectionHead eyebrow="Planos" title="Comece gratis, evolua quando o role pedir">
      Tres caminhos simples: testar, jogar sempre ou levar para uma festa grande com experiencias especiais.
    </SectionHead>
    <div className="landing-plans">
      {PRICING_PLANS.map((plan) => (
        <article className={`landing-plan-card ${plan.featured ? 'featured' : ''} ${plan.highlighted ? 'highlighted' : ''}`} key={plan.name}>
          {plan.badge && <span className="landing-plan-badge">{plan.badge}</span>}
          <div className="landing-plan-heading">
            <h3>{plan.name}</h3>
          </div>
          <div className="landing-price-card">
            <span>Plano</span>
            <div className="landing-price">{plan.price}</div>
          </div>
          <div className="landing-plan-copy">
            {plan.label && <strong className="landing-plan-label">{plan.label}</strong>}
            <p>{plan.description}</p>
          </div>
          <div className="landing-plan-sections">
            {plan.sections.map((section, sectionIndex) => (
              <div className="landing-plan-section" key={`${plan.name}-${section.title ?? sectionIndex}`}>
                {section.title && <h4>{section.title}</h4>}
                <ul className="landing-plan-list">
                  {section.items.map((item) => (
                    <li className={`is-${item.tone ?? 'included'}`} key={item.text}>
                      <span className="landing-plan-icon" aria-hidden="true" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            className={`landing-button landing-button-${plan.variant}`}
            type="button"
            onClick={onSignupClick}
          >
            {plan.cta}
          </button>
        </article>
      ))}
    </div>
  </section>
)
