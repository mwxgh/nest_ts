import { ApiProperty } from '@nestjs/swagger';
import { IsInt, MinLength } from 'class-validator';

export class TagProperties {
  @ApiProperty()
  @MinLength(10)
  name: string;

  @ApiProperty()
  @IsInt()
  status: number;
}

export type CreateTagBody = TagProperties;
export type UpdateTagBody = TagProperties;
