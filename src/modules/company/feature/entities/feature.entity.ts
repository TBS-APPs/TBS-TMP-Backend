import { MainEntity } from 'src/modules/main.entity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { Company } from '../../entities/company.entity';

@Entity()
@Unique(['name', 'company'])
export class Feature extends MainEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Company, (company) => company.features)
  company: Company;
}
