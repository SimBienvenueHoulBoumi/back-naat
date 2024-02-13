import { Profile } from '../../profile/entities/profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile)
  profile: Profile;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
