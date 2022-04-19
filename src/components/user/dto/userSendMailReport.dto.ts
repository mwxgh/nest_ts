import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSendMailReportDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  toEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  linkReport: string;
}
