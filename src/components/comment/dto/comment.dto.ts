import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CommentStatus } from '../entities/comment.entity'
import { Index } from 'typeorm'
import { Type } from 'class-transformer'

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
