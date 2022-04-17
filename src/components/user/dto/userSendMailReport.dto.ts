import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSendMailReportParams {
  @IsEmail()
  @IsNotEmpty()
  toEmail: string;

  @IsNotEmpty()
  linkReport: string;
}
