import { MainEntity } from 'src/modules/main.entity';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Screen } from './screen.entity';

@Entity('screen_translation')
@Unique(['screen', 'locale'])
export class ScreenTranslation extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Screen, (screen) => screen.translations, {
    nullable: false,
  })
  screen: Screen;

  @ManyToOne(() => Locale, { nullable: false })
  locale: Locale;
}
