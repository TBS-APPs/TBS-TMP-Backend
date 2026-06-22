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
    type: 'enum',
    enum: MobilePlatform,
    unique: true,
    nullable: false,
  })
  platform: MobilePlatform;

  @Column({
    nullable: false,
    default: '0.0.0',
  })
  minimumVersion: string;

  @Column({
    nullable: false,
    default: '0.0.0',
  })
  recommendedVersion: string;

  @Column({
    nullable: false,
    default: '0.0.0',
  })
  latestVersion: string;

  @Column({
    nullable: true,
  })
  minimumBuildNumber: number;

  @Column({
    nullable: true,
  })
  recommendedBuildNumber: number;

  @Column({
    nullable: true,
  })
  storeUrl: string;

  @Column({
    nullable: true,
  })
  updateMessage: string;

  @Column({
    nullable: false,
    default: false,
  })
  isMaintenanceModeEnabled: boolean;

  @Column({
    nullable: true,
  })
  maintenanceMessage: string;

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
