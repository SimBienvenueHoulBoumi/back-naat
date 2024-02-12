import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);

    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  async findOne(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
}
