import { MainEntity } from 'src/modules/main.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MobileAppThemePaletteTranslation } from './mobile-app-theme-palette-translation.entity';

@Entity('mobile_app_theme_palette')
export class MobileAppThemePalette extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    nullable: false,
    default: false,
  })
  isDefault: boolean;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  sortOrder: number;

  @Column({
    nullable: false,
  })
  primary: string;

  @Column({
    nullable: false,
  })
  secondary: string;

  @Column({
    nullable: false,
  })
  tertiary: string;

  @OneToMany(
    () => MobileAppThemePaletteTranslation,
    (translation) => translation.palette,
  )
  translations: MobileAppThemePaletteTranslation[];
}

