import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  status: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
