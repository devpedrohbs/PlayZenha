import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { AppConfigService } from '../../config/app-config.service.js';

export interface VerifiedGoogleIdentity {
  subject: string;
  email: string;
  nickname: string;
  emailIsGoogleAuthoritative: boolean;
}

@Injectable()
export class GoogleTokenVerifierService {
  private readonly googleClient = new OAuth2Client();

  constructor(private readonly config: AppConfigService) {}

  async verify(credential: string): Promise<VerifiedGoogleIdentity> {
    const clientId = this.config.authGoogleClientId;

    if (!clientId) {
      throw new ServiceUnavailableException({
        code: 'GOOGLE_AUTH_NOT_CONFIGURED',
        message: 'O login com Google ainda nao foi configurado.',
      });
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        throwInvalidGoogleCredential();
      }

      const email = payload.email.trim().toLowerCase();
      const suggestedNickname = payload.name ?? payload.given_name ?? email.split('@')[0];

      return {
        subject: payload.sub,
        email,
        nickname: normalizeNickname(suggestedNickname),
        emailIsGoogleAuthoritative:
          email.endsWith('@gmail.com') || Boolean(payload.hd),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throwInvalidGoogleCredential();
    }
  }
}

function normalizeNickname(value: string | undefined): string {
  const nickname = value?.replace(/\s+/g, ' ').trim().slice(0, 80);
  return nickname && nickname.length >= 2 ? nickname : 'Jogador';
}

function throwInvalidGoogleCredential(): never {
  throw new UnauthorizedException({
    code: 'INVALID_GOOGLE_CREDENTIAL',
    message: 'Nao foi possivel validar sua conta Google.',
  });
}
