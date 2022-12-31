import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { ContactStatus } from '../entities/contact.entity'

export class ContactProperties {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  userId: number

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  name: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsEmail()
  @Type(() => String)
  email: string

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNotEmpty()
  // @IsPhoneNumber()
  @Type(() => Number)
  phone: number

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  address: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @Type(() => String)
  note: string

  @ApiProperty()
  @IsEnum(ContactStatus)
  @IsOptional()
  status: ContactStatus
}

export class CreateContactDto extends OmitType(
  ContactProperties,
  [] as const,
) {}

export class UpdateContactDto extends PartialType(ContactProperties) {}
