import type { SubscriptionPlan } from './domain/subscription-plan.js';
import type { SubscriptionPlansRepository } from './domain/subscription-plans.repository.js';
import { SubscriptionsService } from './subscriptions.service.js';

const freePlan: SubscriptionPlan = {
  code: 'free',
  name: 'Free',
  priceCents: 0,
  currency: 'BRL',
  billingInterval: 'month',
  entitlements: ['play_free_games'],
  active: true,
};

describe('SubscriptionsService', () => {
  it('returns active plans from the repository', async () => {
    const repository: jest.Mocked<SubscriptionPlansRepository> = {
      findActive: jest.fn().mockResolvedValue([freePlan]),
    };
    const service = new SubscriptionsService(repository);

    await expect(service.findActive()).resolves.toEqual([freePlan]);
    expect(repository.findActive).toHaveBeenCalledTimes(1);
  });
});
