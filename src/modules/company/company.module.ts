import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DynamicsSettingsModule } from './dynamics-settings/dynamics-settings.module';
import { LicenseModule } from './license/license.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    DynamicsSettingsModule,
    LicenseModule,
    FeatureModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
