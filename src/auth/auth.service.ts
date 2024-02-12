import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userdto: UserDto) {
    const existingUser = await this.usersService.findOne(userdto.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists.');
    }
    await this.usersService.create(userdto);
    return {
      result: 'User created successfully!',
    };
  }

  async signIn(userdto: AuthDto) {
    const user = await this.usersService.findOne(userdto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(
      userdto.password,
      user.password,
    );

    if (isPasswordValid) {
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
