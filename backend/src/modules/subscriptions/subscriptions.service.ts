import { Inject, Injectable } from '@nestjs/common';

import type { SubscriptionPlan } from './domain/subscription-plan.js';
import {
  SUBSCRIPTION_PLANS_REPOSITORY,
  type SubscriptionPlansRepository,
} from './domain/subscription-plans.repository.js';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: SubscriptionPlansRepository,
  ) {}

  findActive(): Promise<readonly SubscriptionPlan[]> {
    return this.subscriptionPlansRepository.findActive();
  }
}
