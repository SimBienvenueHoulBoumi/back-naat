import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(register: AuthDto) {
    try {
      return await this.usersService.create({
        username: register.username,
        password: register.password,
      });
    } catch (error) {
      throw new UnauthorizedException(`user already exist`)
        .getResponse()
        .valueOf();
    }
  }

  async signIn(signIn: AuthDto) {
    const user = await this.usersService.findOne(signIn.username);

    if (!user) {
      throw new UnauthorizedException('user not found').getResponse().valueOf();
    }

    const isPasswordValid = await bcrypt.compare(
      signIn.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
        .getResponse()
        .valueOf();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgetPassword(username: string, newPassword: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('User not found').getResponse().valueOf();
    }

    // Générer le nouveau hash de mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;

    try {
      // Sauvegarder les modifications dans la base de données
      await this.usersService.update(user.id, hashedPassword);
    } catch (error) {
      throw new BadRequestException('Password update failed')
        .getResponse()
        .valueOf();
    }

    return { message: 'Password updated successfully' };
  }

  async verifyIdentity(username: string) {
    if (!this.usersService.findOne(username)) {
      throw new UnauthorizedException('user not found').getResponse().valueOf();
    }
  }
}
