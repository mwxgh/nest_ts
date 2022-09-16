import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { CommentStatus } from '../entities/comment.entity';

export class CommentProperties {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  contacts: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  commentAbleId: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  commentAbleType: string;

  @ApiProperty()
  @IsEnum(CommentStatus)
  status: CommentStatus;
}

export class CreateCommentDto extends OmitType(
  CommentProperties,
  [] as const,
) {}

export class UpdateCommentDto extends PartialType(CommentProperties) {}
