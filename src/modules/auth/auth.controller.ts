import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import LoginDto from './dto/login.dto';
import SignUpDto from './dto/signup.dto';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRoles } from 'src/entity/users.entity';
import { AuthGuard } from './auth.guard';

@ApiTags('login')
@Controller({ path: ['auth'] })
export class AuthController {
  constructor(private readonly usersService: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.usersService.login(body);
  }

  @Post('signup')
  @ApiQuery({ name: 'role', enum: UserRoles })
  async signup(@Body() body: SignUpDto, @Query('role') role: UserRoles) {
    return await this.usersService.signup(body, role);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('test')
  async test() {
    return 'pass authentication'
  }
}
