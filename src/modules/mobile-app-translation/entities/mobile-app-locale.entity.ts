import { MainEntity } from 'src/modules/main.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MobileAppTranslation } from './mobile-app-translation.entity';

@Entity('mobile_app_locale')
export class MobileAppLocale extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    nullable: false,
  })
  name: string;

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

  @OneToMany(() => MobileAppTranslation, (translation) => translation.locale)
  translations: MobileAppTranslation[];
}
