import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { BaseUserProperties } from '@userModule/dto/user.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UserLoginDto extends PickType(BaseUserProperties, [
  'email',
  'password',
] as const) {}

export class UserRegisterDto extends OmitType(
  BaseUserProperties,
  [] as const,
) {}

export class LoginGoogleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string
}
