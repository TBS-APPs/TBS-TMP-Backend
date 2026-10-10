import { MainEntity } from 'src/modules/main.entity';
import Module from 'src/modules/module/entities/module.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ScreenTranslation } from './screen-translation.entity';

@Entity()
export class Screen extends MainEntity {
  @Column({
    nullable: true,
  })
  apiId?: number;

  @ManyToOne(() => Module, (module) => module.screens)
  module: Module;

  @OneToMany(() => ScreenTranslation, (translation) => translation.screen)
  translations: ScreenTranslation[];
}
