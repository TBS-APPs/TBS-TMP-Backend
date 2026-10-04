import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Status } from 'src/resources/enums/status.enum';
import DynamicsSetting from '../dynamics-settings/entities/dynamics-setting.entity';
import { License } from '../license/entities/license.entity';
import { MainEntity } from 'src/modules/main.entity';
import { Feature } from '../feature/entities/feature.entity';

@Entity()
export class Company extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  alias: string;

  @OneToOne(() => DynamicsSetting, (dynamicsSetting) => dynamicsSetting.company)
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

  @OneToMany(() => Feature, (feature) => feature.company)
  features: Feature[];
}
