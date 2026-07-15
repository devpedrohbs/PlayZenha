import { useApiQuery } from '../../shared/api'
import { listSubscriptionPlans } from './subscriptions.api'

const EMPTY_PLANS: Awaited<ReturnType<typeof listSubscriptionPlans>> = []

export const useSubscriptionPlans = () =>
  useApiQuery(listSubscriptionPlans, EMPTY_PLANS)
