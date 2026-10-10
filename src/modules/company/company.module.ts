import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from '../locale/locale.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DynamicsSettingsModule } from './dynamics-settings/dynamics-settings.module';
import { Company } from './entities/company.entity';
import { CompanyTranslation } from './entities/company-translation.entity';
import { FeatureModule } from './feature/feature.module';
import { LicenseModule } from './license/license.module';

@Module({
  imports: [
    LocaleModule,
    TypeOrmModule.forFeature([Company, CompanyTranslation]),
    DynamicsSettingsModule,
    LicenseModule,
    FeatureModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
