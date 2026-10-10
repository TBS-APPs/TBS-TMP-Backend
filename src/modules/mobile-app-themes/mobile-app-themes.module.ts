import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from '../locale/locale.module';
import { MobileAppThemePalette } from './entities/mobile-app-theme-palette.entity';
import { MobileAppThemePaletteTranslation } from './entities/mobile-app-theme-palette-translation.entity';
import { MobileAppThemePublicController } from './mobile-app-theme-public.controller';
import { MobileAppThemesController } from './mobile-app-themes.controller';
import { MobileAppThemesService } from './mobile-app-themes.service';

@Module({
  imports: [
    LocaleModule,
    TypeOrmModule.forFeature([
      MobileAppThemePalette,
      MobileAppThemePaletteTranslation,
    ]),
  ],
  controllers: [MobileAppThemePublicController, MobileAppThemesController],
  providers: [MobileAppThemesService],
})
export class MobileAppThemesModule {}
