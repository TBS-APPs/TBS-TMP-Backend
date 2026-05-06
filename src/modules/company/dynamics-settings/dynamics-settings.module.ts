import { Module } from '@nestjs/common';
import { DynamicsSettingsService } from './dynamics-settings.service';
import { DynamicsSettingsController } from './dynamics-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import DynamicsSetting from './entities/dynamics-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicsSetting])],
  controllers: [DynamicsSettingsController],
  providers: [DynamicsSettingsService],
})
export class DynamicsSettingsModule {}
