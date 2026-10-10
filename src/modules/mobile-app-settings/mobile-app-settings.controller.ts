import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MobilePlatform } from 'src/core/enums/mobile-platform.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MobileAppSettingsService } from './mobile-app-settings.service';
import { CreateMobileAppSettingDto } from './dto/create-mobile-app-setting.dto';
import { UpdateMobileAppSettingDto } from './dto/update-mobile-app-setting.dto';

@ApiTags('mobile-app-settings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('mobile-app-settings')
export class MobileAppSettingsController {
  constructor(
    private readonly mobileAppSettingsService: MobileAppSettingsService,
  ) {}

  @Post()
  create(@Body() createMobileAppSettingDto: CreateMobileAppSettingDto) {
    return this.mobileAppSettingsService.create(createMobileAppSettingDto);
  }

  @Get()
  findAll() {
    return this.mobileAppSettingsService.findAll();
  }

  @Get('platform/:platform')
  findByPlatform(
    @Param('platform', new ParseEnumPipe(MobilePlatform))
    platform: MobilePlatform,
  ) {
    return this.mobileAppSettingsService.findByPlatform(platform);
  }

  @Patch('platform/:platform')
  updateByPlatform(
    @Param('platform', new ParseEnumPipe(MobilePlatform))
    platform: MobilePlatform,
    @Body() updateMobileAppSettingDto: UpdateMobileAppSettingDto,
  ) {
    return this.mobileAppSettingsService.updateByPlatform(
      platform,
      updateMobileAppSettingDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobileAppSettingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMobileAppSettingDto: UpdateMobileAppSettingDto,
  ) {
    return this.mobileAppSettingsService.update(id, updateMobileAppSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobileAppSettingsService.remove(id);
  }
}
