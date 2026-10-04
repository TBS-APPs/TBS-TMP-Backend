import { MainEntity } from 'src/modules/main.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MobileAppTranslation } from './mobile-app-translation.entity';

@Entity('mobile_app_translation_key')
export class MobileAppTranslationKey extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  key: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @OneToMany(
    () => MobileAppTranslation,
    (translation) => translation.translationKey,
  )
  translations: MobileAppTranslation[];
}
