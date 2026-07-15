import { SetMetadata } from '@nestjs/common';
import type { ApplicationPermission } from './permission.types.js';

export const REQUIRED_PERMISSION_KEY = 'playzenha.requiredPermission';
export const RequirePermission = (permission: ApplicationPermission) =>
  SetMetadata(REQUIRED_PERMISSION_KEY, permission);
