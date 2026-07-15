import { Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GamesService } from './games.service.js';
import { GameResponseDto } from './presentation/game-response.dto.js';
import { StartGameResponseDto } from './presentation/start-game-response.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { GameAccessPolicyService } from '../authorization/game-access-policy.service.js';

@ApiTags('games')
@Controller('v1/games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameAccessPolicy: GameAccessPolicyService
  ) {}

  @Get()
  @ApiOperation({ summary: 'List catalog games' })
  @ApiOkResponse({ type: GameResponseDto, isArray: true })
  findAll(): Promise<readonly GameResponseDto[]> {
    return this.gamesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get one catalog game by slug' })
  @ApiOkResponse({ type: GameResponseDto })
  @ApiNotFoundResponse({ description: 'Game not found' })
  findBySlug(@Param('slug') slug: string): Promise<GameResponseDto> {
    return this.gamesService.findBySlug(slug);
  }

  @Post(':slug/start')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Authorize and start one game' })
  @ApiOkResponse({ type: StartGameResponseDto })
  start(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<StartGameResponseDto> {
    return this.gameAccessPolicy.authorize(user.sub, slug);
  }
}
