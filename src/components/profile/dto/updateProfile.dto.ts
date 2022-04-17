import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateProfileParams {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  username: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string;
}

export class UpdatePasswordParams {
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
