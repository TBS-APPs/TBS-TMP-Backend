import { MainEntity } from 'src/modules/main.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { MobileAppLocale } from './mobile-app-locale.entity';
import { MobileAppTranslationKey } from './mobile-app-translation-key.entity';

@Entity('mobile_app_translation')
@Unique(['translationKey', 'locale'])
export class MobileAppTranslation extends MainEntity {
  @Column({
    type: 'text',
    nullable: false,
  })
  value: string;

  @ManyToOne(
    () => MobileAppTranslationKey,
    (translationKey) => translationKey.translations,
  )
  translationKey: MobileAppTranslationKey;

  @ManyToOne(() => MobileAppLocale, (locale) => locale.translations)
  locale: MobileAppLocale;
}
