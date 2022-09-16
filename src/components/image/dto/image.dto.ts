import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ImageStatus } from '../entities/image.entity'

export class ImageProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty()
  @IsEnum(ImageStatus)
  @IsNotEmpty()
  status: ImageStatus
}

export class CreateImageDto extends OmitType(ImageProperties, [] as const) {}

export class UpdateImageDto extends PartialType(ImageProperties) {}
