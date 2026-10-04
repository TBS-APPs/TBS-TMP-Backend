import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAppLocale } from './entities/mobile-app-locale.entity';
import { MobileAppTranslationKey } from './entities/mobile-app-translation-key.entity';
import { MobileAppTranslation } from './entities/mobile-app-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MobileAppLocale,
      MobileAppTranslationKey,
      MobileAppTranslation,
    ]),
  ],
})
export class MobileAppTranslationModule {}
