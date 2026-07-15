import { API_ENDPOINTS, apiClient } from '../../shared/api'
import type { SubscriptionPlan } from './domain'

export const listSubscriptionPlans = (signal: AbortSignal) =>
  apiClient.get<SubscriptionPlan[]>(API_ENDPOINTS.subscriptions, { signal })
