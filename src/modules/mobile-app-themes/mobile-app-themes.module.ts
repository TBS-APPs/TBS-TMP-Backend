import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAppThemePalette } from './entities/mobile-app-theme-palette.entity';
import { MobileAppThemePublicController } from './mobile-app-theme-public.controller';
import { MobileAppThemesController } from './mobile-app-themes.controller';
import { MobileAppThemesService } from './mobile-app-themes.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileAppThemePalette])],
  controllers: [MobileAppThemePublicController, MobileAppThemesController],
  providers: [MobileAppThemesService],
})
export class MobileAppThemesModule {}
