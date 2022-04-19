import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserProperties {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}

export class UserLoginDto extends PickType(UserProperties, [
  'email',
  'password',
] as const) {}

export class UserRegisterDto extends PickType(UserProperties, [
  'email',
  'password',
] as const) {}

export class LoginGoogleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
