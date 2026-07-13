import { PLAN_GAME_ENTITLEMENTS, SUBSCRIPTION_PLANS } from './subscription.constants'
import type {
  Entitlement,
  GamePlanRequirement,
  PlanCode,
  SubscriptionPlan
} from './subscription.types'

export function getPlanByCode(code: PlanCode): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.code === code)
}

export function planHasEntitlement(
  plan: PlanCode | SubscriptionPlan,
  entitlement: Entitlement
): boolean {
  const resolvedPlan = typeof plan === 'string' ? getPlanByCode(plan) : plan

  return resolvedPlan?.active === true && resolvedPlan.entitlements.includes(entitlement)
}

/**
 * Frontend convenience only. The backend must validate subscription access
 * before serving protected game content.
 */
export function canAccessGame(
  plan: PlanCode | SubscriptionPlan,
  game: GamePlanRequirement
): boolean {
  return planHasEntitlement(plan, PLAN_GAME_ENTITLEMENTS[game.requiredPlan])
}
