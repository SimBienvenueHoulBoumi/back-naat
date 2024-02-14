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

  async updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // Trouver l'utilisateur dans la base de données
    const user = await this.usersService.findOne(username);

    // Vérifier si l'utilisateur existe
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Vérifier si le mot de passe fourni correspond au mot de passe de l'utilisateur
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // Générer le nouveau hash du mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 est le nombre de tours

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    try {
      // Passer directement le nouveau mot de passe hashé
      await this.usersService.update(user.username, hashedPassword);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException('Password update failed');
    }
  }

  async verifyIdentity(username: string) {
    if (!this.usersService.findOne(username)) {
      throw new UnauthorizedException('user not found').getResponse().valueOf();
    }
  }
}
