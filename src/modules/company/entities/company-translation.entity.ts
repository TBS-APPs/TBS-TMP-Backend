import { MainEntity } from 'src/modules/main.entity';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Company } from './company.entity';

@Entity('company_translation')
@Unique(['company', 'locale'])
export class CompanyTranslation extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Company, (company) => company.translations, {
    nullable: false,
  })
  company: Company;

  @ManyToOne(() => Locale, { nullable: false })
  locale: Locale;
}
