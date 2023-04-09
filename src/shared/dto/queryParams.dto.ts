import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger'
import { PostFilterAttributes } from '@postModule/dto/post.dto'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { SortType } from '../constant/constant'

export class QueryProperties {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  perPage: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  keyword: string

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
  includes: string[]

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortType)
  sortType: SortType
}

export class QueryPaginateDto extends OmitType(QueryProperties, [] as const) {}

export class QueryManyDto extends OmitType(QueryProperties, [] as const) {}

export class QueryListDto extends PickType(QueryProperties, [
  'keyword',
  'includes',
] as const) {}

export class QueryOneDto extends PickType(QueryProperties, [
  'includes',
] as const) {}

export class QueryManyPostDto extends IntersectionType(
  QueryManyDto,
  PostFilterAttributes,
) {}
