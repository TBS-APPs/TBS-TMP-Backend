import { License } from 'src/modules/company/license/entities/license.entity';
import { MainEntity } from 'src/modules/main.entity';
import { Screen } from 'src/modules/screen/entities/screen.entity';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { ModuleTranslation } from './module-translation.entity';

@Entity()
export default class Module extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  alias: string;

  @OneToMany(() => License, (license) => license.module)
  licenses: License[];

  @OneToMany(() => Screen, (screen) => screen.module)
  screens: Screen[];

  @OneToMany(() => ModuleTranslation, (translation) => translation.module)
  translations: ModuleTranslation[];
}

