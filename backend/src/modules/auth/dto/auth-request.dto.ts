import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'Pedrinho' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  nickname!: string;

  @ApiProperty({ example: 'voce@email.com' })
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: 'voce@email.com' })
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class GoogleLoginRequestDto {
  @ApiProperty({ description: 'Google Identity Services ID token' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  credential!: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutRequestDto extends RefreshTokenRequestDto {}

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'voce@email.com' })
  @IsEmail()
  @MaxLength(160)
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'Pedrinho', maxLength: 40 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nickname!: string;
}
