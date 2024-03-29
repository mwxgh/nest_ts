import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { TagStatus } from '../entities/tag.entity'

export class TagProperties {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    enum: TagStatus,
    example: TagStatus.publish,
  })
  @IsOptional()
  @IsEnum(TagStatus)
  status: TagStatus
}

export class CreateTagDto extends PickType(TagProperties, [
  'name',
  'status',
] as const) {}

export class UpdateTagDto extends PartialType(TagProperties) {}
