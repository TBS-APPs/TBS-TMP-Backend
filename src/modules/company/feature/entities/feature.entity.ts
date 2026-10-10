import { MainEntity } from 'src/modules/main.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../entities/company.entity';
import { FeatureTranslation } from './feature-translation.entity';

@Entity()
export class Feature extends MainEntity {
  @ManyToOne(() => Company, (company) => company.features)
  company: Company;

  @OneToMany(() => FeatureTranslation, (translation) => translation.feature)
  translations: FeatureTranslation[];
}
