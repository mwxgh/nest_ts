import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Index } from 'typeorm';

export class CategoryProperties {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryType: string;

  @ApiPropertyOptional({ name: 'parentId', type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  @Index('parentId')
  @Type(() => Number)
  public parentId: number;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status: number;
}

export class CreateCategoryDto extends OmitType(
  CategoryProperties,
  [] as const,
) {}

export class UpdateCategoryDto extends PartialType(CategoryProperties) {}
