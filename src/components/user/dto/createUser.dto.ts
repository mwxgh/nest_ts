import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class AdminCreateUserBodyParam {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string;
}

export class CreateUserDto {}
