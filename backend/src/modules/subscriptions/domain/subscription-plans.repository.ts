import type { SubscriptionPlan } from './subscription-plan.js';

export const SUBSCRIPTION_PLANS_REPOSITORY = Symbol(
  'SUBSCRIPTION_PLANS_REPOSITORY',
);

export interface SubscriptionPlansRepository {
  findActive(): Promise<readonly SubscriptionPlan[]>;
}
