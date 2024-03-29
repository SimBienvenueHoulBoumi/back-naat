import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    return await this.usersService.create({
      username: register.username,
      password: register.password,
    });
  }

  async signIn(signIn: AuthDto) {
    const user = await this.usersService.findOne(signIn.username);

    if (!this.usersService.findOne(signIn.username)) {
      throw new NotFoundException('user not found').getResponse().valueOf();
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
      throw new NotFoundException('User not found').getResponse().valueOf();
    }

    // Vérifier si le mot de passe fourni correspond au mot de passe de l'utilisateur
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password')
        .getResponse()
        .valueOf();
    }

    // Générer le nouveau hash du mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 est le nombre de tours

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    try {
      // Passer directement le nouveau mot de passe hashé
      await this.usersService.update(user.username, hashedPassword);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException('Password update failed')
        .getResponse()
        .valueOf();
    }
  }
}
