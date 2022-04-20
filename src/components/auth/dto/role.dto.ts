import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleProperties {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, default: 1 })
  @IsString()
  @IsNotEmpty()
  level: number;
}

export class CreateRoleDto extends PickType(RoleProperties, [
  'name',
  'level',
] as const) {}

export class UpdateRoleDto extends PartialType(RoleProperties) {}
