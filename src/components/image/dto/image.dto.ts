import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ImageProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string
}

export class CreateImageDto extends ImageProperties {}

export class UpdateImageDto extends PartialType(ImageProperties) {}
