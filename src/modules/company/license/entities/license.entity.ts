import {
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Module from 'src/modules/module/entities/module.entity';
import { Company } from '../../entities/company.entity';

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  seatsLimit: number;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  startDate: Date;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  expirationDate: Date;

  @ManyToOne(() => Module, (module) => module.licenses)
  module: Module;

  @ManyToOne(() => Company, (company) => company.licenses)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
