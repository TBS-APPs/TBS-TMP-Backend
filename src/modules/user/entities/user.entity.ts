import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../user-status.enum';
import { MainEntity } from 'src/modules/main.entity';

@Entity()
export class User extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
    nullable: false,
  })
  status: UserStatus;
}
