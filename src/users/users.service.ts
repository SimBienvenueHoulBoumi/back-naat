import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(userDto: UserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);

    const existingUser = await this.findOne(userDto.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists')
        .getResponse()
        .valueOf();
    }

    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        email: userDto.username,
        firstname: '',
        lastname: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const newProfile = this.profileRepository.create({
      email: userDto.username,
      firstname: '',
      lastname: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.profileRepository.save(newProfile);

    return this.userRepository.save(newUser);
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    return user;
  }

  async update(username: string, password: string) {
    return this.userRepository.update({ username }, { password: password });
  }
}
