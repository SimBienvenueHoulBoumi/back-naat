import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
  ],
  providers: [UsersService, ProfileModule],
  // exporter TypeOrmModule pour utiliser le service à l'extérieur du module
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
