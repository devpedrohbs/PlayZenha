import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { AccessGrantsService } from './access-grants.service.js';
import {
  CreateAccessGrantDto,
  RevokeAccessGrantDto,
} from './dto/access-grant.dto.js';
import { PermissionGuard } from './permissions/permission.guard.js';
import { RequirePermission } from './permissions/require-permission.decorator.js';

@ApiTags('admin-access-grants')
@ApiBearerAuth()
@Controller('v1/admin/access-grants')
@UseGuards(AccessTokenGuard, PermissionGuard)
@RequirePermission('manageAccessGrants')
export class AdminAccessGrantsController {
  constructor(private readonly accessGrantsService: AccessGrantsService) {}

  @Post()
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() body: CreateAccessGrantDto
  ) {
    return this.accessGrantsService.create(actor.sub, body);
  }

  @Delete(':id')
  revoke(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: RevokeAccessGrantDto
  ) {
    return this.accessGrantsService.revoke(actor.sub, id, body.reason);
  }
}
