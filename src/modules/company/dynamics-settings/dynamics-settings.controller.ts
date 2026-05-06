import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicsSettingsService } from './dynamics-settings.service';
import { CreateDynamicsSettingDto } from './dto/create-dynamics-setting.dto';
import { UpdateDynamicsSettingDto } from './dto/update-dynamics-setting.dto';

@Controller('dynamics-settings')
export class DynamicsSettingsController {
  constructor(private readonly dynamicsSettingsService: DynamicsSettingsService) {}

  @Post()
  create(@Body() createDynamicsSettingDto: CreateDynamicsSettingDto) {
    return this.dynamicsSettingsService.create(createDynamicsSettingDto);
  }

  @Get()
  findAll() {
    return this.dynamicsSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicsSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicsSettingDto: UpdateDynamicsSettingDto) {
    return this.dynamicsSettingsService.update(+id, updateDynamicsSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicsSettingsService.remove(+id);
  }
}
