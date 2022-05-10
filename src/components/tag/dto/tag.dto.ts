import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusTag } from '../entities/tag.entity';

export class TagProperties {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: StatusTag,
    type: String,
    example: StatusTag.publish,
  })
  @IsNotEmpty()
  @IsEnum(StatusTag)
  status: string;
}

export class CreateTagDto extends PickType(TagProperties, [
  'name',
  'status',
] as const) {}

export class UpdateTagDto extends PartialType(TagProperties) {}
