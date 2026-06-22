import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MobileAppSettingsService } from './mobile-app-settings.service';
import { MobileAppConfigQueryDto } from './dto/mobile-app-config-query.dto';

@ApiTags('mobile-app')
@Controller('mobile-app')
export class MobileAppConfigController {
  constructor(
    private readonly mobileAppSettingsService: MobileAppSettingsService,
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Check mobile app version and maintenance status' })
  getConfig(@Query() query: MobileAppConfigQueryDto) {
    return this.mobileAppSettingsService.getConfig(query);
  }
}
