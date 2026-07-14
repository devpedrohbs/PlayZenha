import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GamesService } from './games.service.js';
import { GameResponseDto } from './presentation/game-response.dto.js';

@ApiTags('games')
@Controller('v1/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

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
}
