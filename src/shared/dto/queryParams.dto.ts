import { IsString, IsOptional, Min, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  PostPriority,
  PostPrivacy,
  PostStatus,
  PostType,
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

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  @IsOptional()
  includes: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortType)
  sortType: SortType;

  @ApiProperty()
  @IsOptional()
  filters: { [key: string]: string };
}

export class PostProperties {
  @ApiProperty()
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy: string;

  @ApiProperty()
  @IsEnum(PostStatus)
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PostPriority)
  priority: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PostType)
  type: string;
}

export class QueryPaginateDto extends OmitType(QueryProperties, [] as const) {}

export class QueryManyDto extends OmitType(QueryProperties, [] as const) {}

export class QueryListDto extends PickType(QueryProperties, [
  'search',
  'includes',
  'filters',
] as const) {}

export class QueryOneDto extends PickType(QueryProperties, [
  'includes',
] as const) {}

export class QueryManyPostDto extends IntersectionType(
  QueryManyDto,
  PostProperties,
) {}
