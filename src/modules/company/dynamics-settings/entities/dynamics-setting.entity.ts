import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../entities/company.entity';
import { Exclude } from 'class-transformer';
import { MainEntity } from 'src/modules/main.entity';

@Entity()
export default class DynamicsSetting extends MainEntity {
  @Column({
    nullable: false,
  })
  baseUrl: string;

  @Column({
    nullable: false,
  })
  tokenUrl: string;

  @Column({
    nullable: false,
  })
  clientId: string;

  @Column({
    nullable: false,
  })
  clientSecret: string;

  @Column({
    nullable: false,
  })
  tenantId: string;

  @Column({
    nullable: false,
  })
  resource: string;

  @OneToOne(() => Company)
  @JoinColumn()
  company: Company;
}
