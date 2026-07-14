export type PlanCode = 'free' | 'premium' | 'ultimate';

export type BillingInterval = 'month' | 'year';

export type Entitlement =
  | 'play_free_games'
  | 'play_premium_games'
  | 'play_adult_games'
  | 'remove_ads'
  | 'use_ai'
  | 'advanced_statistics'
  | 'early_access';

export interface SubscriptionPlan {
  code: PlanCode;
  name: string;
  priceCents: number;
  currency: 'BRL';
  billingInterval: BillingInterval;
  entitlements: readonly Entitlement[];
  active: boolean;
}
