import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAppConfigController } from './mobile-app-config.controller';
import { MobileAppSettingsController } from './mobile-app-settings.controller';
import { MobileAppSetting } from './entities/mobile-app-setting.entity';
import { MobileAppSettingsService } from './mobile-app-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileAppSetting])],
  controllers: [MobileAppConfigController, MobileAppSettingsController],
  providers: [MobileAppSettingsService],
})
export class MobileAppSettingsModule {}
