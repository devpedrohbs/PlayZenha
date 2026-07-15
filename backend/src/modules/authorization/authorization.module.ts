import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';

import { AdminAccessGrantsController } from './admin-access-grants.controller.js';
import { AccessGrantsService } from './access-grants.service.js';
import { GameAccessPolicyService } from './game-access-policy.service.js';
import { PermissionGuard } from './permissions/permission.guard.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminAccessGrantsController],
  providers: [AccessGrantsService, GameAccessPolicyService, PermissionGuard],
  exports: [GameAccessPolicyService],
})
export class AuthorizationModule {}
