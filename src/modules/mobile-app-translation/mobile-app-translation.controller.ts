import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMobileAppLocaleDto } from './dto/create-mobile-app-locale.dto';
import { CreateMobileAppTranslationDto } from './dto/create-mobile-app-translation.dto';
import { CreateMobileAppTranslationKeyDto } from './dto/create-mobile-app-translation-key.dto';
import { UpdateMobileAppLocaleDto } from './dto/update-mobile-app-locale.dto';
import { UpdateMobileAppTranslationDto } from './dto/update-mobile-app-translation.dto';
import { UpdateMobileAppTranslationKeyDto } from './dto/update-mobile-app-translation-key.dto';
import { UpsertMobileAppTranslationDto } from './dto/upsert-mobile-app-translation.dto';
import { MobileAppTranslationService } from './mobile-app-translation.service';

@ApiTags('mobile-app-translations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('mobile-app-translations')
export class MobileAppTranslationController {
  constructor(
    private readonly mobileAppTranslationService: MobileAppTranslationService,
  ) {}

  // ─── Locales ──────────────────────────────────────────────────────────

  @Post('locales')
  createLocale(@Body() dto: CreateMobileAppLocaleDto) {
    return this.mobileAppTranslationService.createLocale(dto);
  }

  @Get('locales')
  findAllLocales() {
    return this.mobileAppTranslationService.findAllLocales();
  }

  @Get('locales/:id')
  findLocale(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.findLocale(id);
  }

  @Patch('locales/:id')
  updateLocale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMobileAppLocaleDto,
  ) {
    return this.mobileAppTranslationService.updateLocale(id, dto);
  }

  @Delete('locales/:id')
  removeLocale(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.removeLocale(id);
  }

  @Post('locales/:code/import')
  @ApiBody({
    description: 'Full Flutter ARB JSON object for the locale',
    schema: {
      type: 'object',
      additionalProperties: true,
      example: {
        '@@locale': 'en',
        about: 'About',
        criticalError: 'Critical error: {error}',
        '@criticalError': {
          placeholders: { error: { type: 'String' } },
        },
      },
    },
  })
  importArb(
    @Param('code') code: string,
    @Body() arb: Record<string, unknown>,
  ) {
    return this.mobileAppTranslationService.importArb(code, arb);
  }

  // ─── Keys ─────────────────────────────────────────────────────────────

  @Post('keys')
  createKey(@Body() dto: CreateMobileAppTranslationKeyDto) {
    return this.mobileAppTranslationService.createKey(dto);
  }

  @Get('keys')
  findAllKeys() {
    return this.mobileAppTranslationService.findAllKeys();
  }

  @Get('keys/:id')
  findKey(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.findKey(id);
  }

  @Patch('keys/:id')
  updateKey(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMobileAppTranslationKeyDto,
  ) {
    return this.mobileAppTranslationService.updateKey(id, dto);
  }

  @Delete('keys/:id')
  removeKey(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.removeKey(id);
  }

  // ─── Translations ─────────────────────────────────────────────────────

  @Post('translations')
  createTranslation(@Body() dto: CreateMobileAppTranslationDto) {
    return this.mobileAppTranslationService.createTranslation(dto);
  }

  @Get('translations')
  findAllTranslations() {
    return this.mobileAppTranslationService.findAllTranslations();
  }

  @Put('translations')
  upsertTranslation(@Body() dto: UpsertMobileAppTranslationDto) {
    return this.mobileAppTranslationService.upsertTranslation(dto);
  }

  @Get('translations/:id')
  findTranslation(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.findTranslation(id);
  }

  @Patch('translations/:id')
  updateTranslation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMobileAppTranslationDto,
  ) {
    return this.mobileAppTranslationService.updateTranslation(id, dto);
  }

  @Delete('translations/:id')
  removeTranslation(@Param('id', ParseUUIDPipe) id: string) {
    return this.mobileAppTranslationService.removeTranslation(id);
  }
}
