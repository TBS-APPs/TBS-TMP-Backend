import { MainEntity } from 'src/modules/main.entity';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Feature } from './feature.entity';

@Entity('feature_translation')
@Unique(['feature', 'locale'])
export class FeatureTranslation extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Feature, (feature) => feature.translations, {
    nullable: false,
  })
  feature: Feature;

  @ManyToOne(() => Locale, { nullable: false })
  locale: Locale;
}
