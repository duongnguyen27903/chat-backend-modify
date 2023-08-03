import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entity/users.entity';
import LoginDto from './dto/login.dto';
import SignUpDto from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Email or password incorect');
    } else {
      const payload = { email: email };
      const accessToken = await this.jwt.signAsync(payload, {
        expiresIn: '1d',
      });
      return { accessToken, user };
    }
  }

  async signup(signupDto: SignUpDto) {
    const { email, password, name, phone_number } = signupDto;
    if (!!(await this.usersRepository.count({ where: { email: email } })))
      throw new ConflictException(
        'This email address is already used. Try a different email address.',
      );

    const salt = await bcrypt.genSalt();

    try {
      await this.usersRepository.save({
        email: email,
        password: password,
        salt: salt,
        name: name,
        phone_number: phone_number,
      });
      return {
        message: 'Create account successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
