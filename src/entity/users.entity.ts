import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Maps } from './groups.entity';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column()
  phone_number: string;
  @Column()
  salt: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: 'enum', enum: UserRoles })
  role: string

  @OneToMany(() => Maps, (map_user) => map_user.id)
  map_user: Maps[]
}
