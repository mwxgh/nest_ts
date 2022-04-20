import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OptionProperties {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class CreateOptionDto extends PickType(OptionProperties, [
  'key',
  'value',
] as const) {}

export class UpdateOptionDto extends PartialType(OptionProperties) {}
