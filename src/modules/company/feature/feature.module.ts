import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from '../../locale/locale.module';
import { Company } from '../entities/company.entity';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { Feature } from './entities/feature.entity';
import { FeatureTranslation } from './entities/feature-translation.entity';

@Module({
  imports: [
    LocaleModule,
    TypeOrmModule.forFeature([Feature, FeatureTranslation, Company]),
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
