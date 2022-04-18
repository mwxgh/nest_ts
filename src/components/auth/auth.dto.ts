import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UserProperties {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}

export type LoginParams = UserProperties;
export type RegisterParams = UserProperties;
