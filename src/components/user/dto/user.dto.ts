import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
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
}

export class AdminCreateUserDto extends OmitType(UserProperties, [] as const) {}
export class AdminUpdateUserDto extends PartialType(UserProperties) {
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
