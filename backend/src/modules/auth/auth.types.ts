import type {
  AccountStatus,
  PlanCode,
  UserRole,
} from '../../generated/prisma/client.js';

export interface AuthenticatedUser {
  sub: string;
}

export interface PublicUser {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  planCode: PlanCode | null;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}

export interface AuthSession extends AuthResponse {
  refreshToken: string;
}
