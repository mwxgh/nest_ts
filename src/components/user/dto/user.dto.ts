import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserProperties {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  @IsOptional()
  roleIds: number[];
}

export class CreateUserDto extends OmitType(UserProperties, [] as const) {}
export class UpdateUserDto extends PartialType(UserProperties) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  notifyUser: boolean;
}

export class UserSendMailReportDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  toEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  linkReport: string;
}

export class UserRoleProperties {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}

export class UserAttachRoleDto extends PickType(UserRoleProperties, [
  'roleId',
] as const) {}

export class UserDetachRoleDto extends PickType(UserRoleProperties, [
  'roleId',
] as const) {}
