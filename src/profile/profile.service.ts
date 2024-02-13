import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findOne(email: string) {
    return this.profileRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update(username: string, updateProfileDto: UpdateProfileDto) {
    // Récupérer le profil à mettre à jour
    const profile = await this.findOne(username);

    // Vérifier si le profil existe
    if (!profile) {
      throw new UnauthorizedException('Profile not found')
        .getResponse()
        .valueOf();
    }

    // Mettre à jour les champs du profil
    profile.firstname = updateProfileDto.firstname;
    profile.lastname = updateProfileDto.lastname;
    profile.updatedAt = new Date();

    // Enregistrer les modifications dans la base de données
    await this.profileRepository.save(profile);

    // Retourner le profil mis à jour
    return profile;
  }
}
