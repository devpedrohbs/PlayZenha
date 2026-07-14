import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  Game,
  GameDifficulty,
  GamePlan,
  GameStatus,
} from '../domain/game.js';

export class GameResponseDto implements Game {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'impostor' })
  slug!: string;

  @ApiProperty({ example: 'Impostor' })
  name!: string;

  @ApiProperty()
  shortDescription!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty({ minimum: 1 })
  minPlayers!: number;

  @ApiProperty({ minimum: 1 })
  maxPlayers!: number;

  @ApiProperty({ minimum: 1 })
  averageDurationMinutes!: number;

  @ApiProperty({ enum: ['easy', 'medium', 'hard'] })
  difficulty!: GameDifficulty;

  @ApiProperty({ enum: ['available', 'coming-soon', 'disabled'] })
  status!: GameStatus;

  @ApiProperty({ enum: ['free', 'premium', 'ultimate'] })
  requiredPlan!: GamePlan;

  @ApiProperty({ type: [String] })
  tags!: readonly string[];

  @ApiProperty()
  featured!: boolean;

  @ApiProperty()
  isNew!: boolean;

  @ApiPropertyOptional({ nullable: true })
  icon!: string | null;

  @ApiProperty({ type: [String], maxItems: 2 })
  colors!: readonly string[];
}
