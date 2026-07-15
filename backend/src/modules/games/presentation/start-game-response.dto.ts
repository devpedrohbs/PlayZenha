import { ApiProperty } from '@nestjs/swagger';

export class StartGameResponseDto {
  @ApiProperty({ enum: ['subscription', 'administrator', 'allGamesGrant'] })
  source!: string;

  @ApiProperty({ type: Object })
  game!: {
    id: string;
    slug: string;
    name: string;
    requiredPlan: string;
  };

  @ApiProperty()
  contentVersion!: number;

  @ApiProperty({ type: Object, additionalProperties: true })
  content!: unknown;
}
