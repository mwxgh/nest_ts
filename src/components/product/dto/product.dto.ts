import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator'
import { ProductStatus } from '../entities/product.entity'

export class ProductProperties {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsOptional()
  sku: string

  @ApiProperty()
  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status: ProductStatus

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  originalPrice: number

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity: number

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  @IsOptional()
  imageIds: []

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  @IsOptional()
  tagIds: []

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  @IsOptional()
  categoryIds: []
}

export class CreateProductDto extends OmitType(
  ProductProperties,
  [] as const,
) {}

export class UpdateProductDto extends PartialType(ProductProperties) {}
