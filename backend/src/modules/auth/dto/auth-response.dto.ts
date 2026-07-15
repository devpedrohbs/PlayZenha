import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  nickname!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ enum: ['player', 'admin'] })
  role!: string;

  @ApiProperty({ enum: ['active', 'suspended', 'disabled'] })
  status!: string;

  @ApiProperty({ enum: ['free', 'premium', 'ultimate'], nullable: true })
  planCode!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AuthTokensDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: 900 })
  expiresIn!: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;
}

export class PasswordResetRequestResponseDto {
  @ApiProperty()
  message!: string;

  @ApiProperty({ required: false })
  resetToken?: string;
}
