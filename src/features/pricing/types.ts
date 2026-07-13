import type { PlanCode } from '../subscriptions'

export type PlanVariant = 'ghost' | 'primary' | 'blue'

export interface PricingPlanCard {
  planCode: PlanCode
  description: string
  cta: string
  variant: PlanVariant
  badge?: string
  label?: string
  featured?: boolean
  highlighted?: boolean
  sections: PlanSection[]
}

export interface PlanSection {
  title?: string
  items: PlanItem[]
}

export interface PlanItem {
  text: string
  tone?: 'included' | 'excluded' | 'note'
}
