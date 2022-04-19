import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class AdminCreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string;
}
