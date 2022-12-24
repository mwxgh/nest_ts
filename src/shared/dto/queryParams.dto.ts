import { IsString, IsOptional, Min, IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger'
import { SortType } from '../constant/constant'
import { PostFilterAttributes } from 'src/components/post/dto/post.dto'

export class QueryProperties {
  @ApiProperty()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  page: number

  @ApiProperty()
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  perPage: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string

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

  @ApiProperty()
  @IsOptional()
  filter: { [key: string]: string }
}

export class QueryPaginateDto extends OmitType(QueryProperties, [] as const) {}

export class QueryManyDto extends OmitType(QueryProperties, [] as const) {}

export class QueryListDto extends PickType(QueryProperties, [
  'search',
  'includes',
  'filter',
] as const) {}

export class QueryOneDto extends PickType(QueryProperties, [
  'includes',
] as const) {}

export class QueryManyPostDto extends IntersectionType(
  QueryManyDto,
  PostFilterAttributes,
) {}
