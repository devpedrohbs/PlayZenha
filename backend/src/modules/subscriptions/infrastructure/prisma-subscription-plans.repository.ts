import { Injectable } from '@nestjs/common';

import type { SubscriptionPlan as PrismaSubscriptionPlan } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../../database/prisma.service.js';
import type { SubscriptionPlan } from '../domain/subscription-plan.js';
import type { SubscriptionPlansRepository } from '../domain/subscription-plans.repository.js';

@Injectable()
export class PrismaSubscriptionPlansRepository
  implements SubscriptionPlansRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findActive(): Promise<readonly SubscriptionPlan[]> {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { active: true },
      orderBy: { priceCents: 'asc' },
    });

    return plans.map(mapSubscriptionPlan);
  }
}

function mapSubscriptionPlan(plan: PrismaSubscriptionPlan): SubscriptionPlan {
  return {
    ...plan,
    code: plan.code,
    currency: plan.currency,
    billingInterval: plan.billingInterval,
    entitlements: plan.entitlements,
  };
}
