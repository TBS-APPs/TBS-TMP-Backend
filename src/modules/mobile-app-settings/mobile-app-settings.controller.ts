import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobileAppSettingsService } from './mobile-app-settings.service';
import { CreateMobileAppSettingDto } from './dto/create-mobile-app-setting.dto';
import { UpdateMobileAppSettingDto } from './dto/update-mobile-app-setting.dto';

@Controller('mobile-app-settings')
export class MobileAppSettingsController {
  constructor(private readonly mobileAppSettingsService: MobileAppSettingsService) {}

  @Post()
  create(@Body() createMobileAppSettingDto: CreateMobileAppSettingDto) {
    return this.mobileAppSettingsService.create(createMobileAppSettingDto);
  }

  @Get()
  findAll() {
    return this.mobileAppSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobileAppSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobileAppSettingDto: UpdateMobileAppSettingDto) {
    return this.mobileAppSettingsService.update(+id, updateMobileAppSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobileAppSettingsService.remove(+id);
  }
}
