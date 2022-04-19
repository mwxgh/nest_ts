import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MinLength } from 'class-validator';

export class TagProperties {
  @ApiProperty()
  @MinLength(10)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  status: number;
}

export class CreateTagDto extends PickType(TagProperties, [
  'name',
  'status',
] as const) {}

export class UpdateTagDto extends PartialType(TagProperties) {}
