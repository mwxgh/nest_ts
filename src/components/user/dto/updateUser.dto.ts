import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AdminCreateUserDto } from './createUser.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class AdminUpdateUserDto extends PartialType(AdminCreateUserDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  notifyUser: boolean;
}
