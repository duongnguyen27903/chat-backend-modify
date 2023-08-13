import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export default class SignUpDto {
  @IsEmail()
  @ApiProperty({ required: true, example: 'user@gmail.com' })
  readonly email: string;

  @ApiProperty({ required: true })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @ApiProperty({ required: true })
  @MaxLength(30)
  readonly name: string;

  @ApiProperty()
  @MaxLength(16)
  readonly phone_number: string;
}
