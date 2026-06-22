import { Exclude } from 'class-transformer';
import { MobilePlatform } from 'src/core/enums/mobile-platform.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MobileAppSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    enum: MobilePlatform,
  })
  platform: MobilePlatform;

  @Column({
    nullable: false,
    default: false,
  })
  isMaintenanceModeEnabled: boolean;

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
