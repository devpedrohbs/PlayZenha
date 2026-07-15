import {
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import type { AppConfigService } from '../../config/app-config.service.js';
import { GoogleTokenVerifierService } from './google-token-verifier.service.js';

describe('GoogleTokenVerifierService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('validates the audience and maps the stable Google subject', async () => {
    const verifyIdToken = jest
      .spyOn(OAuth2Client.prototype, 'verifyIdToken')
      .mockResolvedValue({
        getPayload: () => ({
          sub: 'google-subject-123',
          email: 'PLAYER@GMAIL.COM',
          email_verified: true,
          name: '  Player   One  ',
        }),
      } as never);
    const service = new GoogleTokenVerifierService({
      authGoogleClientId: 'web-client.apps.googleusercontent.com',
    } as AppConfigService);

    await expect(service.verify('signed-id-token')).resolves.toEqual({
      subject: 'google-subject-123',
      email: 'player@gmail.com',
      nickname: 'Player One',
      emailIsGoogleAuthoritative: true,
    });
    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: 'signed-id-token',
      audience: 'web-client.apps.googleusercontent.com',
    });
  });

  it('denies an unverified Google e-mail', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        sub: 'google-subject-123',
        email: 'player@example.com',
        email_verified: false,
      }),
    } as never);
    const service = new GoogleTokenVerifierService({
      authGoogleClientId: 'web-client.apps.googleusercontent.com',
    } as AppConfigService);

    await expect(service.verify('signed-id-token')).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it('fails closed when Google authentication is not configured', async () => {
    const service = new GoogleTokenVerifierService({
      authGoogleClientId: undefined,
    } as AppConfigService);

    await expect(service.verify('signed-id-token')).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });
});
