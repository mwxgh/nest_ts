import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class AdminUpdateUserBodyParam {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  notifyUser: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
