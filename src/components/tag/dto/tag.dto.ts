import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TagStatus } from '../entities/tag.entity';

export class TagProperties {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: TagStatus,
    type: String,
    example: TagStatus.publish,
  })
  @IsNotEmpty()
  @IsEnum(TagStatus)
  status: string;
}

export class CreateTagDto extends PickType(TagProperties, [
  'name',
  'status',
] as const) {}

export class UpdateTagDto extends PartialType(TagProperties) {}
