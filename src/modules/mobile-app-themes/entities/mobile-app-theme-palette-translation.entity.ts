import { MainEntity } from 'src/modules/main.entity';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { MobileAppThemePalette } from './mobile-app-theme-palette.entity';

@Entity('mobile_app_theme_palette_translation')
@Unique(['palette', 'locale'])
export class MobileAppThemePaletteTranslation extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(
    () => MobileAppThemePalette,
    (palette) => palette.translations,
    { nullable: false },
  )
  palette: MobileAppThemePalette;

  @ManyToOne(() => Locale, { nullable: false })
  locale: Locale;
}
