import type { Entitlement, PlanCode, SubscriptionPlan } from './subscription.types'

export const PLAN_GAME_ENTITLEMENTS: Record<PlanCode, Entitlement> = {
  free: 'play_free_games',
  premium: 'play_premium_games',
  ultimate: 'play_adult_games'
}

export const SUBSCRIPTION_PLANS = [
  {
    code: 'free',
    name: 'PlayZenha Free',
    priceCents: 0,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: ['play_free_games'],
    active: true
  },
  {
    code: 'premium',
    name: 'PlayZenha Premium',
    priceCents: 2490,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: [
      'play_free_games',
      'play_premium_games',
      'remove_ads',
      'use_ai',
      'advanced_statistics',
      'early_access'
    ],
    active: true
  },
  {
    code: 'ultimate',
    name: 'PlayZenha Ultimate',
    priceCents: 3490,
    currency: 'BRL',
    billingInterval: 'month',
    entitlements: [
      'play_free_games',
      'play_premium_games',
      'play_adult_games',
      'remove_ads',
      'use_ai',
      'advanced_statistics',
      'early_access'
    ],
    active: true
  }
] as const satisfies readonly SubscriptionPlan[]
