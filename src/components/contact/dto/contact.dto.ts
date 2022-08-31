import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  // IsPhoneNumber,
} from 'class-validator';

export class ContactProperties {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  name: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsEmail()
  @Type(() => String)
  email: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNotEmpty()
  // @IsPhoneNumber()
  @Type(() => Number)
  phone: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  address: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  note: string;

  @ApiPropertyOptional({
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status: number;
}

export class CreateContactDto extends OmitType(
  ContactProperties,
  [] as const,
) {}

export class UpdateContactDto extends PartialType(ContactProperties) {}
