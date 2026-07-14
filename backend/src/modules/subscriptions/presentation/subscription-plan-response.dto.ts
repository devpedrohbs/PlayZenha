import { ApiProperty } from '@nestjs/swagger';

import type {
  BillingInterval,
  Entitlement,
  PlanCode,
  SubscriptionPlan,
} from '../domain/subscription-plan.js';

export class SubscriptionPlanResponseDto implements SubscriptionPlan {
  @ApiProperty({ enum: ['free', 'premium', 'ultimate'] })
  code!: PlanCode;

  @ApiProperty()
  name!: string;

  @ApiProperty({ minimum: 0, example: 2490 })
  priceCents!: number;

  @ApiProperty({ enum: ['BRL'] })
  currency!: 'BRL';

  @ApiProperty({ enum: ['month', 'year'] })
  billingInterval!: BillingInterval;

  @ApiProperty({
    enum: [
      'play_free_games',
      'play_premium_games',
      'play_adult_games',
      'remove_ads',
      'use_ai',
      'advanced_statistics',
      'early_access',
    ],
    isArray: true,
  })
  entitlements!: readonly Entitlement[];

  @ApiProperty()
  active!: boolean;
}
