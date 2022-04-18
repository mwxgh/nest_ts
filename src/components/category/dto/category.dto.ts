import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { Index } from 'typeorm';

export class CategoryProperties {
  @ApiProperty()
  name: string;

  @ApiProperty()
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

export type CreateCategoryParams = CategoryProperties;
export type UpdateCategoryParams = CategoryProperties;
