import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DynamicsSettingsService } from './dynamics-settings.service';
import { CreateDynamicsSettingDto } from './dto/create-dynamics-setting.dto';
import { UpdateDynamicsSettingDto } from './dto/update-dynamics-setting.dto';
import { UpsertDynamicsSettingDto } from './dto/upsert-dynamics-setting.dto';

@Controller('dynamics-settings')
export class DynamicsSettingsController {
  constructor(
    private readonly dynamicsSettingsService: DynamicsSettingsService,
  ) {}

  @Post()
  create(@Body() createDynamicsSettingDto: CreateDynamicsSettingDto) {
    return this.dynamicsSettingsService.create(createDynamicsSettingDto);
  }

  @Get()
  findAll() {
    return this.dynamicsSettingsService.findAll();
  }

  @Post('company/:companyId')
  upsertByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() upsertDynamicsSettingDto: UpsertDynamicsSettingDto,
  ) {
    return this.dynamicsSettingsService.upsertByCompanyId(
      companyId,
      upsertDynamicsSettingDto,
    );
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.dynamicsSettingsService.findByCompanyId(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicsSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDynamicsSettingDto: UpdateDynamicsSettingDto,
  ) {
    return this.dynamicsSettingsService.update(+id, updateDynamicsSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicsSettingsService.remove(+id);
  }
}
