import { Module } from '@nestjs/common';

import { SUBSCRIPTION_PLANS_REPOSITORY } from './domain/subscription-plans.repository.js';
import { PrismaSubscriptionPlansRepository } from './infrastructure/prisma-subscription-plans.repository.js';
import { SubscriptionsController } from './subscriptions.controller.js';
import { SubscriptionsService } from './subscriptions.service.js';

@Module({
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    {
      provide: SUBSCRIPTION_PLANS_REPOSITORY,
      useClass: PrismaSubscriptionPlansRepository,
    },
  ],
})
export class SubscriptionsModule {}
