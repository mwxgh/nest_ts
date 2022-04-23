import {
  IsString,
  IsOptional,
  Min,
  IsNumber,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  PriorityPost,
  PrivacyPost,
  StatusPost,
  TypePost,
} from 'src/components/post/entities/post.entity';
import { SortType } from '../constant/constant';

export class QueryProperties {
  @ApiProperty()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  perPage: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  includes: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortType)
  sortType: string;

  @ApiProperty()
  @IsOptional()
  @ArrayMinSize(1)
  sortBy: string[];

  @ApiProperty()
  @IsOptional()
  filters: { [key: string]: string };
}

export class QueryPostProperties {
  @ApiProperty()
  @IsOptional()
  @IsEnum(PrivacyPost)
  privacy: string;

  @ApiProperty()
  @IsEnum(StatusPost)
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PriorityPost)
  priority: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TypePost)
  type: string;
}

export class QueryPaginateDto extends OmitType(QueryProperties, [] as const) {}

export class QueryListDto extends PickType(QueryProperties, [
  'search',
  'includes',
  'filters',
] as const) {}

export class QueryOneDto extends PickType(QueryProperties, [
  'includes',
] as const) {}

export class QueryPostPaginateDto extends IntersectionType(
  QueryPaginateDto,
  QueryPostProperties,
) {}

export class QueryPostListDto extends IntersectionType(
  QueryListDto,
  QueryPostProperties,
) {}
