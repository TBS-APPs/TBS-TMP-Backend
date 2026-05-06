import { Injectable } from '@nestjs/common';
import { CreateDynamicsSettingDto } from './dto/create-dynamics-setting.dto';
import { UpdateDynamicsSettingDto } from './dto/update-dynamics-setting.dto';

@Injectable()
export class DynamicsSettingsService {
  create(createDynamicsSettingDto: CreateDynamicsSettingDto) {
    return 'This action adds a new dynamicsSetting';
  }

  findAll() {
    return `This action returns all dynamicsSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicsSetting`;
  }

  update(id: number, updateDynamicsSettingDto: UpdateDynamicsSettingDto) {
    return `This action updates a #${id} dynamicsSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicsSetting`;
  }
}
