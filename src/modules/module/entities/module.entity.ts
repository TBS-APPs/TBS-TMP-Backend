import { Exclude } from 'class-transformer';
import { License } from 'src/modules/company/license/entities/license.entity';
import { MainEntity } from 'src/modules/main.entity';
import { Screen } from 'src/modules/screen/entities/screen.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Module extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => License, (license) => license.module)
  licenses: License[];

  @OneToMany(() => Screen, (screen) => screen.module)
  screens: Screen[];
}
