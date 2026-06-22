import { Module } from '@nestjs/common';
import { MobileAppSettingsService } from './mobile-app-settings.service';
import { MobileAppSettingsController } from './mobile-app-settings.controller';

@Module({
  controllers: [MobileAppSettingsController],
  providers: [MobileAppSettingsService],
})
export class MobileAppSettingsModule {}
