import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SubscriptionPlanResponseDto } from './presentation/subscription-plan-response.dto.js';
import { SubscriptionsService } from './subscriptions.service.js';

@ApiTags('subscriptions')
@Controller('v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List active subscription plans' })
  @ApiOkResponse({ type: SubscriptionPlanResponseDto, isArray: true })
  findActive(): Promise<readonly SubscriptionPlanResponseDto[]> {
    return this.subscriptionsService.findActive();
  }
}
