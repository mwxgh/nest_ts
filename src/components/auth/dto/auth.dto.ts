import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserProperties {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  lastName: string;
}

export class UserLoginDto extends PickType(UserProperties, [
  'email',
  'password',
] as const) {}

export class UserRegisterDto extends OmitType(UserProperties, [] as const) {}

export class LoginGoogleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
