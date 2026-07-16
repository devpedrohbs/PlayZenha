import { AsyncContentState, Button } from '../../../shared/components/ui'
import { useSubscriptionPlans } from '../../subscriptions'
import type { PlanCode } from '../../subscriptions'
import { PRICING_PLAN_CARDS } from '../../pricing/plans'
import { SectionHead } from './SectionHead'

interface PricingSectionProps {
  onPlanClick: (planCode: PlanCode) => void
  reveal?: boolean
}

export const PricingSection = ({ onPlanClick, reveal = true }: PricingSectionProps) => {
  return (
    <section className={`landing-section ${reveal ? 'reveal' : ''}`} id="planos">
      <SectionHead eyebrow="Planos" title="Teste gratis. Assine quando a galera pedir outro jogo.">
        O Premium e a escolha recomendada hoje: libera os quatro jogos disponiveis para o grupo. O Ultimate acompanha os proximos modos especiais.
      </SectionHead>
      <PricingPlanCards onPlanClick={onPlanClick} />
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
        const priceContext = getPriceContext(plan.code, plan.priceCents)

        return (
        <article className={`landing-plan-card ${card.featured ? 'featured' : ''} ${card.highlighted ? 'highlighted' : ''} ${recommendedPlanCode === plan.code ? 'highlighted' : ''}`} key={plan.code}>
          {(currentPlanCode === plan.code ? 'Plano atual' : card.badge) && <span className="landing-plan-badge">{currentPlanCode === plan.code ? 'Plano atual' : card.badge}</span>}
          <div className="landing-plan-heading">
            <h3>{plan.name}</h3>
          </div>
          <div className="landing-price-card">
            <span>{plan.priceCents === 0 ? 'Para sempre' : 'Assinatura mensal'}</span>
            <div className="landing-price">{priceLabel}</div>
            {priceContext && <small className="landing-price-context">{priceContext}</small>}
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

function getPriceContext(planCode: PlanCode, priceCents: number): string | null {
  if (planCode === 'free') return 'Sem cartao para comecar'
  if (priceCents <= 0) return null

  const perPerson = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(priceCents / 100 / 10)

  return `${perPerson} por pessoa em um grupo de 10`
}
