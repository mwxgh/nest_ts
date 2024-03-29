import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { UserEntity, UserStatus } from '../entities/user.entity'

export class BaseUserProperties {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  firstName: string

  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  lastName: string

  @ApiProperty({
    enum: UserStatus,
    isArray: true,
    default: UserStatus.active,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus
}

export class UserProperties extends OmitType(BaseUserProperties, [] as const) {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  @IsOptional()
  roleIds: number[]
}

export class CreateUserDto extends OmitType(UserProperties, [] as const) {}
export class UpdateUserDto extends PartialType(UserProperties) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  notifyUser: boolean
}

export class UpdateUserPasswordDto extends PickType(UserProperties, [
  'password',
]) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  notifyUser: boolean
}

export class InviteUserDto extends PickType(BaseUserProperties, [
  'email',
] as const) {}

export class UserSendMailReportDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  toEmail: string

  @ApiProperty()
  @IsNotEmpty()
  linkReport: string
}

export type Me = UserEntity
