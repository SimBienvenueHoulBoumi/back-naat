import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // exporter TypeOrmModule pour utiliser le service à l'extérieur du module
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
