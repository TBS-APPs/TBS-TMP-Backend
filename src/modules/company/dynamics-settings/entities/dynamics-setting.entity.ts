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

@Entity()
export default class DynamicsSetting {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
