import { MainEntity } from 'src/modules/main.entity';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import Module from './module.entity';

@Entity('module_translation')
@Unique(['module', 'locale'])
export class ModuleTranslation extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Module, (module) => module.translations, {
    nullable: false,
  })
  module: Module;

  @ManyToOne(() => Locale, { nullable: false })
  locale: Locale;
}
