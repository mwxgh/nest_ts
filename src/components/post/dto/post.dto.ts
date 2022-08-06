import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, MinLength } from 'class-validator';

export class PostProperties {
  @ApiProperty()
  @MinLength(10)
  title: string;

  @ApiProperty()
  @MinLength(10)
  description: string;

  @ApiProperty()
  @MinLength(10)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  type: string;

  @ApiProperty({ default: 1 })
  status: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
      default: 0,
    },
  })
  @IsArray()
  tagIds: [];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
      default: 0,
    },
  })
  @IsArray()
  categoryIds: [];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsArray()
  imageIds: [];
}

export class CreatePostDto extends OmitType(PostProperties, [] as const) {}

export class UpdatePostDto extends PartialType(PostProperties) {}

export class Pagination {
  @ApiProperty()
  @MinLength(10)
  include: string;
}
