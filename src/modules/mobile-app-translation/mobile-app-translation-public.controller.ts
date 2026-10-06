import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MobileAppTranslationService } from './mobile-app-translation.service';

@ApiTags('mobile-app')
@Controller('mobile-app')
export class MobileAppTranslationPublicController {
  constructor(
    private readonly mobileAppTranslationService: MobileAppTranslationService,
  ) {}

  @Get('translations')
  @ApiOperation({ summary: 'List active mobile app locales' })
  listLocales() {
    return this.mobileAppTranslationService.listActiveLocales();
  }

  @Get('translations/:locale')
  @ApiOperation({
    summary: 'Get Flutter ARB translations for a locale',
  })
  getArb(@Param('locale') locale: string) {
    return this.mobileAppTranslationService.getArbByLocale(locale);
  }
}
