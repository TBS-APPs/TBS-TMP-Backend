import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { readFileSync } from 'fs';
import { join } from 'path';
import { QueryFailedError, Repository } from 'typeorm';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { CreateMobileAppLocaleDto } from './dto/create-mobile-app-locale.dto';
import { CreateMobileAppTranslationDto } from './dto/create-mobile-app-translation.dto';
import { CreateMobileAppTranslationKeyDto } from './dto/create-mobile-app-translation-key.dto';
import { UpdateMobileAppLocaleDto } from './dto/update-mobile-app-locale.dto';
import { UpdateMobileAppTranslationDto } from './dto/update-mobile-app-translation.dto';
import { UpdateMobileAppTranslationKeyDto } from './dto/update-mobile-app-translation-key.dto';
import { UpsertMobileAppTranslationDto } from './dto/upsert-mobile-app-translation.dto';
import { MobileAppLocale } from './entities/mobile-app-locale.entity';
import { MobileAppTranslation } from './entities/mobile-app-translation.entity';
import { MobileAppTranslationKey } from './entities/mobile-app-translation-key.entity';

export type ArbMap = Record<string, string | Record<string, unknown>>;

@Injectable()
export class MobileAppTranslationService implements OnModuleInit {
  private readonly logger = new Logger(MobileAppTranslationService.name);

  constructor(
    @InjectRepository(MobileAppLocale)
    private readonly localeRepository: Repository<MobileAppLocale>,
    @InjectRepository(MobileAppTranslationKey)
    private readonly keyRepository: Repository<MobileAppTranslationKey>,
    @InjectRepository(MobileAppTranslation)
    private readonly translationRepository: Repository<MobileAppTranslation>,
    private readonly i18n: I18nService,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  // ─── Public ───────────────────────────────────────────────────────────

  async listActiveLocales() {
    try {
      const locales = await this.localeRepository.find({
        where: { isActive: true },
        order: { isDefault: 'DESC', code: 'ASC' },
      });
      return successResponse({
        data: locales.map((locale) => ({
          code: locale.code,
          name: locale.name,
          isDefault: locale.isDefault,
        })),
      });
    } catch {
      return errorResponse();
    }
  }

  async getArbByLocale(
    localeCode: string,
  ): Promise<ApiResponse<ArbMap | null>> {
    try {
      const locale = await this.localeRepository.findOne({
        where: { code: localeCode, isActive: true },
      });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }

      const translations = await this.translationRepository.find({
        where: { locale: { id: locale.id } },
        relations: { translationKey: true },
      });

      const arb: ArbMap = { '@@locale': locale.code };
      for (const translation of translations) {
        const key = translation.translationKey.key;
        arb[key] = translation.value;
        if (translation.translationKey.metadata) {
          arb[`@${key}`] = translation.translationKey.metadata;
        }
      }

      return successResponse({ data: arb });
    } catch {
      return errorResponse();
    }
  }

  // ─── Locales CRUD ─────────────────────────────────────────────────────

  async createLocale(dto: CreateMobileAppLocaleDto) {
    try {
      if (dto.isDefault) {
        await this.clearDefaultLocales();
      }
      const locale = await this.localeRepository.save(dto);
      return successResponse({ data: locale });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.LOCALE_CODE_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAllLocales() {
    try {
      const locales = await this.localeRepository.find({
        order: { code: 'ASC' },
      });
      return successResponse({ data: locales });
    } catch {
      return errorResponse();
    }
  }

  async findLocale(id: number) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }
      return successResponse({ data: locale });
    } catch {
      return errorResponse();
    }
  }

  async updateLocale(id: number, dto: UpdateMobileAppLocaleDto) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }
      if (dto.isDefault) {
        await this.clearDefaultLocales();
      }
      await this.localeRepository.update(id, dto);
      const updated = await this.localeRepository.findOne({ where: { id } });
      return successResponse({ data: updated });
    } catch {
      return errorResponse();
    }
  }

  async removeLocale(id: number) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }
      await this.localeRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  // ─── Keys CRUD ────────────────────────────────────────────────────────

  async createKey(dto: CreateMobileAppTranslationKeyDto) {
    try {
      const key = await this.keyRepository.save(dto);
      return successResponse({ data: key });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.TRANSLATION_KEY_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAllKeys() {
    try {
      const keys = await this.keyRepository.find({ order: { key: 'ASC' } });
      return successResponse({ data: keys });
    } catch {
      return errorResponse();
    }
  }

  async findKey(id: number) {
    try {
      const key = await this.keyRepository.findOne({ where: { id } });
      if (!key) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_KEY_NOT_FOUND),
        });
      }
      return successResponse({ data: key });
    } catch {
      return errorResponse();
    }
  }

  async updateKey(id: number, dto: UpdateMobileAppTranslationKeyDto) {
    try {
      const key = await this.keyRepository.findOne({ where: { id } });
      if (!key) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_KEY_NOT_FOUND),
        });
      }
      Object.assign(key, dto);
      const updated = await this.keyRepository.save(key);
      return successResponse({ data: updated });
    } catch {
      return errorResponse();
    }
  }

  async removeKey(id: number) {
    try {
      const key = await this.keyRepository.findOne({ where: { id } });
      if (!key) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_KEY_NOT_FOUND),
        });
      }
      await this.keyRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  // ─── Translations CRUD ────────────────────────────────────────────────

  async createTranslation(dto: CreateMobileAppTranslationDto) {
    try {
      const translationKey = await this.keyRepository.findOne({
        where: { id: dto.translationKeyId },
      });
      if (!translationKey) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_KEY_NOT_FOUND),
        });
      }
      const locale = await this.localeRepository.findOne({
        where: { id: dto.localeId },
      });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }

      const translation = await this.translationRepository.save({
        value: dto.value,
        translationKey,
        locale,
      });
      return successResponse({ data: translation });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.TRANSLATION_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAllTranslations() {
    try {
      const translations = await this.translationRepository.find({
        relations: { translationKey: true, locale: true },
        order: { id: 'ASC' },
      });
      return successResponse({ data: translations });
    } catch {
      return errorResponse();
    }
  }

  async findTranslation(id: number) {
    try {
      const translation = await this.translationRepository.findOne({
        where: { id },
        relations: { translationKey: true, locale: true },
      });
      if (!translation) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_NOT_FOUND),
        });
      }
      return successResponse({ data: translation });
    } catch {
      return errorResponse();
    }
  }

  async updateTranslation(id: number, dto: UpdateMobileAppTranslationDto) {
    try {
      const translation = await this.translationRepository.findOne({
        where: { id },
      });
      if (!translation) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_NOT_FOUND),
        });
      }
      await this.translationRepository.update(id, { value: dto.value });
      const updated = await this.translationRepository.findOne({
        where: { id },
        relations: { translationKey: true, locale: true },
      });
      return successResponse({ data: updated });
    } catch {
      return errorResponse();
    }
  }

  async removeTranslation(id: number) {
    try {
      const translation = await this.translationRepository.findOne({
        where: { id },
      });
      if (!translation) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_TRANSLATION_NOT_FOUND),
        });
      }
      await this.translationRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  async upsertTranslation(dto: UpsertMobileAppTranslationDto) {
    try {
      const locale = await this.localeRepository.findOne({
        where: { code: dto.localeCode },
      });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }

      let translationKey = await this.keyRepository.findOne({
        where: { key: dto.key },
      });
      if (!translationKey) {
        translationKey = await this.keyRepository.save({ key: dto.key });
      }

      let translation = await this.translationRepository.findOne({
        where: {
          translationKey: { id: translationKey.id },
          locale: { id: locale.id },
        },
        relations: { translationKey: true, locale: true },
      });

      if (translation) {
        translation.value = dto.value;
        translation = await this.translationRepository.save(translation);
      } else {
        translation = await this.translationRepository.save({
          value: dto.value,
          translationKey,
          locale,
        });
      }

      return successResponse({ data: translation });
    } catch {
      return errorResponse();
    }
  }

  async importArb(localeCode: string, arb: Record<string, unknown>) {
    try {
      const locale = await this.localeRepository.findOne({
        where: { code: localeCode },
      });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_LOCALE_NOT_FOUND),
        });
      }

      const result = await this.importArbForLocale(locale, arb);
      return successResponse({ data: result });
    } catch (error) {
      this.logger.error('Failed to import ARB', error);
      return errorResponse();
    }
  }

  // ─── Seed / import helpers ────────────────────────────────────────────

  private async seedDefaults() {
    try {
      await this.ensureLocale('en', 'English', true);
      await this.ensureLocale('ar', 'Arabic', false);

      const keyCount = await this.keyRepository.count();
      if (keyCount > 0) {
        return;
      }

      const enLocale = await this.localeRepository.findOne({
        where: { code: 'en' },
      });
      const arLocale = await this.localeRepository.findOne({
        where: { code: 'ar' },
      });
      if (!enLocale || !arLocale) {
        return;
      }

      const enArb = this.loadSeedArb('en.arb.json');
      const arArb = this.loadSeedArb('ar.arb.json');

      if (enArb) {
        await this.importArbForLocale(enLocale, enArb);
        this.logger.log('Seeded English mobile app translations');
      }
      if (arArb) {
        await this.importArbForLocale(arLocale, arArb);
        this.logger.log('Seeded Arabic mobile app translations');
      }
    } catch (error) {
      this.logger.error('Failed to seed mobile app translations', error);
    }
  }

  private loadSeedArb(filename: string): Record<string, unknown> | null {
    try {
      const filePath = join(__dirname, 'seed', filename);
      const raw = readFileSync(filePath, 'utf8');
      return JSON.parse(raw) as Record<string, unknown>;
    } catch (error) {
      this.logger.warn(`Could not load seed file ${filename}`, error);
      return null;
    }
  }

  private async ensureLocale(
    code: string,
    name: string,
    isDefault: boolean,
  ): Promise<MobileAppLocale> {
    let locale = await this.localeRepository.findOne({ where: { code } });
    if (!locale) {
      if (isDefault) {
        await this.clearDefaultLocales();
      }
      locale = await this.localeRepository.save({
        code,
        name,
        isDefault,
        isActive: true,
      });
    }
    return locale;
  }

  private async importArbForLocale(
    locale: MobileAppLocale,
    arb: Record<string, unknown>,
  ): Promise<{ keysUpserted: number; translationsUpserted: number }> {
    let keysUpserted = 0;
    let translationsUpserted = 0;

    const metadataByKey = new Map<string, Record<string, unknown>>();
    const valuesByKey = new Map<string, string>();

    for (const [rawKey, rawValue] of Object.entries(arb)) {
      if (rawKey === '@@locale') {
        continue;
      }

      if (rawKey.startsWith('@@')) {
        continue;
      }

      if (rawKey.startsWith('@')) {
        const baseKey = rawKey.slice(1);
        if (
          baseKey &&
          rawValue !== null &&
          typeof rawValue === 'object' &&
          !Array.isArray(rawValue)
        ) {
          metadataByKey.set(baseKey, rawValue as Record<string, unknown>);
        }
        continue;
      }

      if (typeof rawValue === 'string') {
        valuesByKey.set(rawKey, rawValue);
      }
    }

    const allKeys = new Set([
      ...valuesByKey.keys(),
      ...metadataByKey.keys(),
    ]);

    for (const key of allKeys) {
      let translationKey = await this.keyRepository.findOne({
        where: { key },
      });

      const metadata = metadataByKey.get(key);
      if (!translationKey) {
        translationKey = await this.keyRepository.save({
          key,
          metadata: metadata ?? null,
        });
        keysUpserted += 1;
      } else if (metadata) {
        translationKey.metadata = metadata;
        await this.keyRepository.save(translationKey);
        keysUpserted += 1;
      }

      const value = valuesByKey.get(key);
      if (value === undefined) {
        continue;
      }

      let translation = await this.translationRepository.findOne({
        where: {
          translationKey: { id: translationKey.id },
          locale: { id: locale.id },
        },
      });

      if (translation) {
        translation.value = value;
        await this.translationRepository.save(translation);
      } else {
        await this.translationRepository.save({
          value,
          translationKey,
          locale,
        });
      }
      translationsUpserted += 1;
    }

    return { keysUpserted, translationsUpserted };
  }

  private async clearDefaultLocales() {
    await this.localeRepository
      .createQueryBuilder()
      .update(MobileAppLocale)
      .set({ isDefault: false })
      .where('isDefault = :isDefault', { isDefault: true })
      .execute();
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    );
  }
}
