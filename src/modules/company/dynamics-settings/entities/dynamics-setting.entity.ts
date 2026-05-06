import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
