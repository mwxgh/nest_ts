import { IsString, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class QueryProperties {
  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

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
  includes: string;

  @ApiProperty()
  @IsOptional()
  filters: { [key: string]: string };
}

export class QueryPaginateDto extends OmitType(QueryProperties, [] as const) {}

export class QueryListDto extends PickType(QueryProperties, [
  'search',
  'includes',
  'filters',
] as const) {}
