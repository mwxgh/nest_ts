import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ImageProperties {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  imageAbleId: number;

  @ApiPropertyOptional({})
  @IsString()
  @IsNotEmpty()
  imageAbleType: string;
}

export class CreateImageDto extends OmitType(ImageProperties, [] as const) {}

export class UpdateImageDto extends PartialType(ImageProperties) {}
