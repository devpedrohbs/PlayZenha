import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodError } from 'zod';

import type { Entitlement, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { parseGameContent } from '../games/content/game-content.schemas.js';
import type { AuthorizedGame, GameAccessSource } from './access-decision.types.js';

const REQUIRED_ENTITLEMENT = {
  free: 'play_free_games',
  premium: 'play_premium_games',
  ultimate: 'play_adult_games',
} as const satisfies Record<string, Entitlement>;

type AccessUser = Prisma.UserGetPayload<{
  include: {
    subscription: { include: { plan: true } };
    accessGrants: true;
  };
}>;

@Injectable()
export class GameAccessPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async authorize(userId: string, slug: string): Promise<AuthorizedGame> {
    const now = new Date();
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: { include: { plan: true } },
        accessGrants: {
          where: {
            type: 'allGames',
            startsAt: { lte: now },
            revokedAt: null,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_REQUIRED',
        message: 'Entre para iniciar este jogo.',
      });
    }

    if (user.status !== 'active') {
      throw new ForbiddenException({
        code: 'ACCOUNT_INACTIVE',
        message: 'Esta conta nao pode iniciar jogos.',
      });
    }

    const game = await this.prisma.game.findFirst({
      where: {
        slug,
        status: 'available',
        publishedAt: { not: null },
      },
      include: { content: true },
    });

    if (!game || !game.content?.active) {
      throw new NotFoundException({
        code: 'GAME_NOT_AVAILABLE',
        message: 'Este jogo nao esta disponivel.',
      });
    }

    const source = this.resolveAccessSource(user, game.requiredPlan, now);
    if (!source) {
      throw new ForbiddenException({
        code: 'GAME_ACCESS_DENIED',
        message: 'Seu plano atual nao libera este jogo.',
        game: { name: game.name, requiredPlan: game.requiredPlan },
      });
    }

    let content: unknown;
    try {
      content = parseGameContent(game.slug, game.content.payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ServiceUnavailableException({
          code: 'GAME_CONTENT_INVALID',
          message: 'O conteudo deste jogo esta temporariamente indisponivel.',
        });
      }
      throw error;
    }

    return {
      source,
      game: {
        id: game.id,
        slug: game.slug,
        name: game.name,
        requiredPlan: game.requiredPlan,
      },
      content,
      contentVersion: game.content.version,
    };
  }

  private resolveAccessSource(
    user: AccessUser,
    requiredPlan: 'free' | 'premium' | 'ultimate',
    now: Date
  ): GameAccessSource | null {
    if (user.role === 'admin') return 'administrator';
    if (user.accessGrants.length > 0) return 'allGamesGrant';

    const subscription = user.subscription;
    if (!subscription || !['active', 'trialing'].includes(subscription.status)) {
      return null;
    }
    if (subscription.startsAt > now) return null;
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd <= now) {
      return null;
    }
    if (!subscription.plan.active) return null;

    return subscription.plan.entitlements.includes(
      REQUIRED_ENTITLEMENT[requiredPlan]
    )
      ? 'subscription'
      : null;
  }

}
