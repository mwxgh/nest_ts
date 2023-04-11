import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Index } from 'typeorm'
import { CategoryStatus } from '../entities/category.entity'

export class CategoryProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ name: 'parentId', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Index('parentId')
  @Type(() => Number)
  public parentId: number

  @ApiProperty()
  @IsEnum(CategoryStatus)
  @IsOptional()
  status: CategoryStatus
}

export class CreateCategoryDto extends OmitType(
  CategoryProperties,
  [] as const,
) {}

export class UpdateCategoryDto extends PartialType(CategoryProperties) {}
