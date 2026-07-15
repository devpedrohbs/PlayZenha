import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { AppConfigService } from '../../config/app-config.service.js';
import type { AuthSession } from './auth.types.js';
import type { AuthenticatedUser } from './auth.types.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import {
  AuthResponseDto,
  PasswordResetRequestResponseDto,
  PublicUserDto,
} from './dto/auth-response.dto.js';
import {
  LoginRequestDto,
  GoogleLoginRequestDto,
  RegisterRequestDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './dto/auth-request.dto.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';

@ApiTags('auth')
@Controller('v1')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService
  ) {}

  @Post('auth/register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Create a user account' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'E-mail already registered' })
  async register(
    @Body() body: RegisterRequestDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    return this.finishSession(await this.authService.register(body), response);
  }

  @Post('auth/login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate with e-mail and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    return this.finishSession(await this.authService.login(body), response);
  }

  @Post('auth/google')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate with a Google ID token' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid Google credential' })
  async loginWithGoogle(
    @Body() body: GoogleLoginRequestDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    return this.finishSession(
      await this.authService.loginWithGoogle(body.credential),
      response
    );
  }

  @Post('auth/refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate a refresh token and issue a new session' })
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    this.assertTrustedOrigin(request);
    const session = await this.authService.refresh(this.readRefreshCookie(request));
    return this.finishSession(session, response);
  }

  @Post('auth/logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke the current refresh token' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    this.assertTrustedOrigin(request);
    const refreshToken = this.readRefreshCookie(request);
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.clearRefreshCookie(response);
  }

  @Post('auth/forgot-password')
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password recovery instructions' })
  @ApiOkResponse({ type: PasswordResetRequestResponseDto })
  requestPasswordReset(
    @Body() body: RequestPasswordResetDto
  ): Promise<PasswordResetRequestResponseDto> {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('auth/reset-password')
  @HttpCode(204)
  @ApiOperation({ summary: 'Reset password with a recovery token' })
  resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(body);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  me(@CurrentUser() user: AuthenticatedUser): Promise<PublicUserDto> {
    return this.authService.getProfile(user.sub);
  }

  @Patch('me/profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiOkResponse({ type: PublicUserDto })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateProfileDto
  ): Promise<PublicUserDto> {
    return this.authService.updateProfile(user.sub, body);
  }

  private finishSession(
    session: AuthSession,
    response: Response
  ): AuthResponseDto {
    response.cookie(this.config.authRefreshCookieName, session.refreshToken, {
      httpOnly: true,
      maxAge: this.config.authRefreshTokenTtlSeconds * 1000,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: this.config.authCookieSecure,
    });
    return { user: session.user, tokens: session.tokens };
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie(this.config.authRefreshCookieName, {
      httpOnly: true,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: this.config.authCookieSecure,
    });
  }

  private assertTrustedOrigin(request: Request): void {
    const origin = request.headers.origin;
    if (origin && !this.config.corsOrigins.includes(origin)) {
      throw new ForbiddenException({
        code: 'UNTRUSTED_ORIGIN',
        message: 'Origem da requisicao nao autorizada.',
      });
    }
  }

  private readRefreshCookie(request: Request): string {
    const cookies: unknown = request.cookies;
    if (!cookies || typeof cookies !== 'object') {
      return '';
    }

    const refreshToken = (cookies as Record<string, unknown>)[
      this.config.authRefreshCookieName
    ];
    return typeof refreshToken === 'string' ? refreshToken : '';
  }
}
