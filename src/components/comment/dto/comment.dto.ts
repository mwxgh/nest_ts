import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Index } from 'typeorm'
import { CommentStatus } from '../entities/comment.entity'

export class CommentProperties {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(CommentStatus)
  status: CommentStatus

  @ApiProperty({ name: 'parentId', type: Number })
  @IsOptional()
  @IsNumber()
  @Index('parentId')
  @Type(() => Number)
  public parentId: number
}

export class CreateCommentDto extends OmitType(
  CommentProperties,
  [] as const,
) {}

export class UpdateCommentDto extends PartialType(
  PickType(CommentProperties, ['content', 'status']),
) {}
