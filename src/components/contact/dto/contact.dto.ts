import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class ContactProperties {
  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Type(() => String)
  email: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Type(() => String)
  phone: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
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
