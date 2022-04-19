import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  status: number;
}

export class CreateCommentDto extends OmitType(
  CommentProperties,
  [] as const,
) {}

export class UpdateCommentDto extends PickType(CommentProperties, [
  'contacts',
  'fullName',
  'contacts',
  'status',
] as const) {}
