import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
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
  @IsEnum(CommentStatus)
  status: CommentStatus

  @ApiProperty({ name: 'parentId', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Index('parentId')
  @Type(() => Number)
  public parentId: number
}

export class CreateCommentDto extends OmitType(
  CommentProperties,
  [] as const,
) {}

export class UpdateCommentDto extends PartialType(CommentProperties) {}
