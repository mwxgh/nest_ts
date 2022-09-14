import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductProperties {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '' })
  slug: string;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsOptional()
  images: [];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsOptional()
  tagIds: [];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
      default: 0,
    },
  })
  @IsArray()
  categoryIds: [];

  @ApiProperty()
  @IsOptional()
  sku: string;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  originalPrice: number;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class CreateProductDto extends OmitType(
  ProductProperties,
  [] as const,
) {}

export class UpdateProductDto extends PartialType(ProductProperties) {}
