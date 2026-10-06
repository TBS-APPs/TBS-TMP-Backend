import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAppLocale } from './entities/mobile-app-locale.entity';
import { MobileAppTranslation } from './entities/mobile-app-translation.entity';
import { MobileAppTranslationKey } from './entities/mobile-app-translation-key.entity';
import { MobileAppTranslationController } from './mobile-app-translation.controller';
import { MobileAppTranslationPublicController } from './mobile-app-translation-public.controller';
import { MobileAppTranslationService } from './mobile-app-translation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MobileAppLocale,
      MobileAppTranslationKey,
      MobileAppTranslation,
    ]),
  ],
  controllers: [
    MobileAppTranslationPublicController,
    MobileAppTranslationController,
  ],
  providers: [MobileAppTranslationService],
})
export class MobileAppTranslationModule {}
