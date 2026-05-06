import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Status } from 'src/resources/enums/status.enum';
import DynamicsSetting from '../dynamics-settings/entities/dynamics-setting.entity';
import { License } from '../license/entities/license.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  alias: string;

  @OneToOne(() => DynamicsSetting)
  @JoinColumn()
  dynamicsSettings: DynamicsSetting;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    nullable: false,
  })
  status: Status;

  @OneToMany(() => License, (license) => license.company)
  licenses: License[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
