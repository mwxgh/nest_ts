import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import { IsArray, IsDate, IsEnum, IsOptional, MinLength } from 'class-validator'
import {
  PostPriority,
  PostPrivacy,
  PostStatus,
  PostType,
} from '../entities/post.entity'

export class PostBaseAttributes {
  @ApiProperty()
  @MinLength(5)
  title: string

  @ApiProperty()
  @MinLength(10)
  summary: string

  @ApiProperty()
  @MinLength(10)
  description: string

  @ApiProperty()
  @MinLength(10)
  content: string

  @ApiProperty()
  @IsDate()
  @IsOptional()
  releaseDate: Date
}

export class PostFilterAttributes {
  @ApiProperty()
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy: PostPrivacy

  @ApiProperty()
  @IsEnum(PostStatus)
  @IsOptional()
  status: PostStatus

  @ApiProperty()
  @IsOptional()
  @IsEnum(PostPriority)
  priority: PostPriority

  @ApiProperty()
  @IsOptional()
  @IsEnum(PostType)
  type: PostType
}

export class PostProperties extends IntersectionType(
  PostBaseAttributes,
  PostFilterAttributes,
) {
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsOptional()
  @IsArray()
  tagIds: []

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsOptional()
  @IsArray()
  categoryIds: []

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'int',
    },
  })
  @IsOptional()
  @IsArray()
  imageIds: []
}

export class CreatePostDto extends OmitType(PostProperties, [] as const) {}

export class UpdatePostDto extends PartialType(PostProperties) {}
