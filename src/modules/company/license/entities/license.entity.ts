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
import { Exclude } from 'class-transformer';
import { Status } from 'src/resources/enums/status.enum';

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


  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    nullable: false,
  })
  status: Status;

  @ManyToOne(() => Module, (module) => module.licenses)
  module: Module;

  @ManyToOne(() => Company, (company) => company.licenses)
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
