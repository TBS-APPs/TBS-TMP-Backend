import { Injectable } from '@nestjs/common';
import { CreateMobileAppSettingDto } from './dto/create-mobile-app-setting.dto';
import { UpdateMobileAppSettingDto } from './dto/update-mobile-app-setting.dto';

@Injectable()
export class MobileAppSettingsService {
  create(createMobileAppSettingDto: CreateMobileAppSettingDto) {
    return 'This action adds a new mobileAppSetting';
  }

  findAll() {
    return `This action returns all mobileAppSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mobileAppSetting`;
  }

  update(id: number, updateMobileAppSettingDto: UpdateMobileAppSettingDto) {
    return `This action updates a #${id} mobileAppSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} mobileAppSetting`;
  }
}
