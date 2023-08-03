import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { isEmail } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;
  @ApiProperty()
  @Column()
  password: string;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  phone_number: string;
  @Column()
  salt: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
