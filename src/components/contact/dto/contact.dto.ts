import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ContactType } from '../entities/contact.entity'

export class ContactProperties {
  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  name: string

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNotEmpty()
  // @IsPhoneNumber()
  @Type(() => String)
  phone: number

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  address: string

  @ApiProperty()
  @IsEnum(ContactType)
  @IsNotEmpty()
  type: ContactType
}

export class CreateContactDto extends OmitType(
  ContactProperties,
  [] as const,
) {}

export class UpdateContactDto extends PartialType(ContactProperties) {}
