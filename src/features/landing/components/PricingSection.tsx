import { AsyncContentState, Button } from '../../../shared/components/ui'
import { useSubscriptionPlans } from '../../subscriptions'
import type { PlanCode } from '../../subscriptions'
import { PRICING_PLAN_CARDS } from '../../pricing/plans'
import { SectionHead } from './SectionHead'

interface PricingSectionProps {
  onSignupClick: () => void
  reveal?: boolean
}

export const PricingSection = ({ onSignupClick, reveal = true }: PricingSectionProps) => {
  return (
    <section className={`landing-section ${reveal ? 'reveal' : ''}`} id="planos">
      <SectionHead eyebrow="Planos" title="Comece gratis, evolua quando o role pedir">
        Tres caminhos simples: testar, jogar sempre ou levar para uma festa grande com experiencias especiais.
      </SectionHead>
      <PricingPlanCards onPlanClick={() => onSignupClick()} />
    </section>
  )
}

interface PricingPlanCardsProps {
  onPlanClick: (planCode: PlanCode) => void
  currentPlanCode?: PlanCode | null
  recommendedPlanCode?: PlanCode
}

/**
 * Cards únicos para a página de planos e para fluxos de upgrade, sempre com
 * preço e disponibilidade vindos da API de assinaturas.
 */
export const PricingPlanCards = ({
  onPlanClick,
  currentPlanCode,
  recommendedPlanCode
}: PricingPlanCardsProps) => {
  const { data: plans, error, isLoading, reload } = useSubscriptionPlans()

  return <>
    {isLoading ? (
      <AsyncContentState className="landing-data-state" title="Carregando planos" description="Consultando os planos ativos." isLoading />
    ) : error ? (
      <AsyncContentState className="landing-data-state" title="Nao foi possivel carregar os planos" description={error} onRetry={reload} />
    ) : plans.length === 0 ? (
      <AsyncContentState className="landing-data-state" title="Nenhum plano disponivel" description="Os planos ainda nao foram publicados." onRetry={reload} />
    ) : (
      <div className="landing-plans">
      {PRICING_PLAN_CARDS.map((card) => {
        const plan = plans.find((candidate) => candidate.code === card.planCode)
        if (!plan) return null

        const price = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: plan.currency,
          minimumFractionDigits: plan.priceCents === 0 ? 0 : 2
        }).format(plan.priceCents / 100)
        const priceLabel = plan.priceCents === 0 ? price : `${price}/${plan.billingInterval === 'month' ? 'mes' : 'ano'}`

        return (
        <article className={`landing-plan-card ${card.featured ? 'featured' : ''} ${card.highlighted ? 'highlighted' : ''} ${recommendedPlanCode === plan.code ? 'highlighted' : ''}`} key={plan.code}>
          {(currentPlanCode === plan.code ? 'Plano atual' : card.badge) && <span className="landing-plan-badge">{currentPlanCode === plan.code ? 'Plano atual' : card.badge}</span>}
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
            onClick={() => onPlanClick(plan.code)}
            disabled={currentPlanCode === plan.code}
          >
            {currentPlanCode === plan.code ? 'Plano atual' : card.cta}
          </Button>
        </article>
        )
      })}
      </div>
    )}
  </>
}
