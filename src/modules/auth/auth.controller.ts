import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import LoginDto from './dto/login.dto';
import SignUpDto from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('login')
@Controller({ path: ['auth'] })
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.usersService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    return await this.usersService.signup(body);
  }
}
