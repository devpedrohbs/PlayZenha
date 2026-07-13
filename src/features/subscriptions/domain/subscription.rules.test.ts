import { describe, expect, it } from 'vitest'
import {
  canAccessGame,
  getPlanByCode,
  planHasEntitlement
} from './subscription.rules'
import type { PlanCode } from './subscription.types'

describe('subscription rules', () => {
  it('finds plans by their stable code', () => {
    expect(getPlanByCode('premium')).toMatchObject({
      code: 'premium',
      priceCents: 2490,
      currency: 'BRL'
    })
  })

  it('checks entitlements granted by each plan', () => {
    expect(planHasEntitlement('free', 'play_free_games')).toBe(true)
    expect(planHasEntitlement('free', 'remove_ads')).toBe(false)
    expect(planHasEntitlement('premium', 'use_ai')).toBe(true)
    expect(planHasEntitlement('ultimate', 'play_adult_games')).toBe(true)
  })

  it('uses the required plan entitlement as a frontend access hint', () => {
    expect(canAccessGame('free', { requiredPlan: 'free' })).toBe(true)
    expect(canAccessGame('premium', { requiredPlan: 'free' })).toBe(true)
    expect(canAccessGame('premium', { requiredPlan: 'ultimate' })).toBe(false)
    expect(canAccessGame('ultimate', { requiredPlan: 'ultimate' })).toBe(true)
  })

  it('treats an unknown plan safely', () => {
    expect(getPlanByCode('unknown' as PlanCode)).toBeUndefined()
    expect(planHasEntitlement('unknown' as PlanCode, 'play_free_games')).toBe(false)
  })
})
