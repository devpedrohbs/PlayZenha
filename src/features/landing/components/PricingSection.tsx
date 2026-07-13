import { Button } from '../../../shared/components/ui'
import { getPlanByCode } from '../../subscriptions'
import { PRICING_PLAN_CARDS } from '../../pricing/plans'
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
      {PRICING_PLAN_CARDS.map((card) => {
        const plan = getPlanByCode(card.planCode)
        if (!plan) return null

        const price = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: plan.currency,
          minimumFractionDigits: plan.priceCents === 0 ? 0 : 2
        }).format(plan.priceCents / 100)
        const priceLabel = plan.priceCents === 0 ? price : `${price}/${plan.billingInterval === 'month' ? 'mes' : 'ano'}`

        return (
        <article className={`landing-plan-card ${card.featured ? 'featured' : ''} ${card.highlighted ? 'highlighted' : ''}`} key={plan.code}>
          {card.badge && <span className="landing-plan-badge">{card.badge}</span>}
          <div className="landing-plan-heading">
            <h3>{plan.name}</h3>
          </div>
          <div className="landing-price-card">
            <span>Plano</span>
            <div className="landing-price">{priceLabel}</div>
          </div>
          <div className="landing-plan-copy">
            {card.label && <strong className="landing-plan-label">{card.label}</strong>}
            <p>{card.description}</p>
          </div>
          <div className="landing-plan-sections">
            {card.sections.map((section, sectionIndex) => (
              <div className="landing-plan-section" key={`${plan.code}-${section.title ?? sectionIndex}`}>
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
          <Button
            className={`landing-button landing-button-${card.variant}`}
            type="button"
            variant={card.variant === 'blue' ? 'secondary' : card.variant === 'ghost' ? 'ghost' : 'primary'}
            onClick={onSignupClick}
          >
            {card.cta}
          </Button>
        </article>
        )
      })}
    </div>
  </section>
)
