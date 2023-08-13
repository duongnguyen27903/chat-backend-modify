import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  @ApiProperty({ required: true, example: 'duong@admin.com' })
  readonly email: string;

  @ApiProperty({ required: true, example: '123456' })
  readonly password: string;
}
