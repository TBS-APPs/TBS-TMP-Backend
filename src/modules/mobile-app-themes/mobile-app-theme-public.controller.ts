import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MobileAppThemesService } from './mobile-app-themes.service';

@ApiTags('mobile-app')
@Controller('mobile-app')
export class MobileAppThemePublicController {
  constructor(private readonly mobileAppThemesService: MobileAppThemesService) {}

  @Get('themes')
  @ApiOperation({ summary: 'List active mobile app theme palettes' })
  listThemes(@Query('include') include?: string) {
    return this.mobileAppThemesService.listActivePalettes({ include });
  }

  @Get('themes/:code')
  @ApiOperation({ summary: 'Get an active mobile app theme palette by code' })
  getTheme(
    @Param('code') code: string,
    @Query('include') include?: string,
  ) {
    return this.mobileAppThemesService.getActivePaletteByCode(code, {
      include,
    });
  }
}
