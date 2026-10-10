import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { In, QueryFailedError, Repository } from 'typeorm';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import {
  EntityTranslationItem,
  getDefaultLocale,
  hasDefaultLocaleTranslation,
  mapTranslationViews,
  presentTranslatedEntity,
  TranslationPresentOptions,
} from 'src/core/utils/entity-translation';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { CreateMobileAppThemePaletteDto } from './dto/create-mobile-app-theme-palette.dto';
import { UpdateMobileAppThemePaletteDto } from './dto/update-mobile-app-theme-palette.dto';
import { MobileAppThemePalette } from './entities/mobile-app-theme-palette.entity';
import { MobileAppThemePaletteTranslation } from './entities/mobile-app-theme-palette-translation.entity';

const TRANSLATION_RELATIONS = {
  translations: {
    locale: true,
  },
} as const;

const SEED_PALETTES: Array<{
  code: string;
  label: string;
  isDefault: boolean;
  sortOrder: number;
  primary: string;
  secondary: string;
  tertiary: string;
}> = [
  {
    code: 'olive',
    label: 'Olive',
    isDefault: true,
    sortOrder: 0,
    primary: '#556B2F',
    secondary: '#eba20e',
    tertiary: '#7BC3FA',
  },
  {
    code: 'navy',
    label: 'Navy',
    isDefault: false,
    sortOrder: 1,
    primary: '#00599C',
    secondary: '#2259BF',
    tertiary: '#DAE9F8',
  },
  {
    code: 'metallicGold',
    label: 'Metallic Gold',
    isDefault: false,
    sortOrder: 2,
    primary: '#D4AF37',
    secondary: '#8B1E3F',
    tertiary: '#F9F3E1',
  },
  {
    code: 'blueSpruce',
    label: 'Blue Spruce',
    isDefault: false,
    sortOrder: 3,
    primary: '#00796B',
    secondary: '#FF7043',
    tertiary: '#D9EBE9',
  },
  {
    code: 'pacificBlue',
    label: 'Pacific Blue',
    isDefault: false,
    sortOrder: 4,
    primary: '#00ACC1',
    secondary: '#6A1B9A',
    tertiary: '#D9F3F6',
  },
];

@Injectable()
export class MobileAppThemesService implements OnModuleInit {
  constructor(
    @InjectRepository(MobileAppThemePalette)
    private readonly paletteRepository: Repository<MobileAppThemePalette>,
    @InjectRepository(MobileAppThemePaletteTranslation)
    private readonly translationRepository: Repository<MobileAppThemePaletteTranslation>,
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>,
    private readonly i18n: I18nService,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async create(dto: CreateMobileAppThemePaletteDto) {
    try {
      const translationError = await this.validateTranslations(dto.translations);
      if (translationError) {
        return translationError;
      }
      const { translations, ...payload } = dto;
      if (payload.isDefault) {
        await this.clearDefaultPalettes();
      }
      const palette = await this.paletteRepository.save(payload);
      await this.upsertTranslations(palette, translations);
      const saved = await this.findPaletteById(palette.id);
      return successResponse({
        data: await this.toAdmin(saved!),
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.THEME_PALETTE_CODE_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAll(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [palettes, defaultLocale] = await Promise.all([
        this.paletteRepository.find({
          relations: TRANSLATION_RELATIONS,
          order: { sortOrder: 'ASC', id: 'ASC' },
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: palettes.map((palette) =>
          presentTranslatedEntity(palette, palette.translations, options),
        ),
      });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string, presentOptions: TranslationPresentOptions = {}) {
    try {
      const palette = await this.findPaletteById(id);
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      return successResponse({
        data: await this.toAdmin(palette, presentOptions),
      });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, dto: UpdateMobileAppThemePaletteDto) {
    try {
      const palette = await this.findPaletteById(id);
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      const { translations, ...payload } = dto;
      if (translations?.length) {
        const translationError = await this.validateTranslations(translations);
        if (translationError) {
          return translationError;
        }
      }
      if (payload.isDefault) {
        await this.clearDefaultPalettes();
      }
      if (Object.keys(payload).length) {
        await this.paletteRepository.update(id, payload);
      }
      if (translations?.length) {
        const updatedPalette = await this.paletteRepository.findOne({
          where: { id },
        });
        await this.upsertTranslations(updatedPalette!, translations);
      }
      const updated = await this.findPaletteById(id);
      return successResponse({
        data: await this.toAdmin(updated!),
      });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      const palette = await this.paletteRepository.findOne({ where: { id } });
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      if (palette.isDefault) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.CANNOT_DELETE_DEFAULT_THEME_PALETTE),
        });
      }
      await this.paletteRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  async listActivePalettes(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [palettes, defaultLocale] = await Promise.all([
        this.paletteRepository.find({
          where: { isActive: true },
          relations: TRANSLATION_RELATIONS,
          order: { sortOrder: 'ASC', id: 'ASC' },
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: palettes.map((palette) => this.toPublic(palette, options)),
      });
    } catch {
      return errorResponse();
    }
  }

  async getActivePaletteByCode(
    code: string,
    presentOptions: TranslationPresentOptions = {},
  ) {
    try {
      const [palette, defaultLocale] = await Promise.all([
        this.paletteRepository.findOne({
          where: { code, isActive: true },
          relations: TRANSLATION_RELATIONS,
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      return successResponse({
        data: this.toPublic(palette, {
          ...presentOptions,
          defaultLocaleCode: defaultLocale?.code,
        }),
      });
    } catch {
      return errorResponse();
    }
  }

  private async toAdmin(
    palette: MobileAppThemePalette,
    presentOptions: TranslationPresentOptions = {},
  ) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    return presentTranslatedEntity(palette, palette.translations, {
      ...presentOptions,
      defaultLocaleCode: defaultLocale?.code,
    });
  }

  private toPublic(
    palette: MobileAppThemePalette,
    presentOptions: TranslationPresentOptions = {},
  ) {
    return presentTranslatedEntity(
      {
        code: palette.code,
        isDefault: palette.isDefault,
        sortOrder: palette.sortOrder,
        primary: palette.primary,
        secondary: palette.secondary,
        tertiary: palette.tertiary,
      },
      palette.translations,
      presentOptions,
    );
  }

  private async findPaletteById(id: string) {
    return this.paletteRepository.findOne({
      where: { id },
      relations: TRANSLATION_RELATIONS,
    });
  }

  private async validateTranslations(translations: EntityTranslationItem[]) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    if (!defaultLocale) {
      return errorResponse({
        message: this.i18n.t(ERROR_KEYS.LOCALE_NOT_FOUND),
      });
    }
    if (!hasDefaultLocaleTranslation(translations, defaultLocale.code)) {
      return errorResponse({
        message: this.i18n.t(ERROR_KEYS.DEFAULT_LOCALE_TRANSLATION_REQUIRED),
      });
    }
    return null;
  }

  private async upsertTranslations(
    palette: MobileAppThemePalette,
    items: EntityTranslationItem[],
  ) {
    const locales = await this.localeRepository.find({
      where: { code: In(items.map((item) => item.localeCode)) },
    });
    const localeByCode = new Map(locales.map((locale) => [locale.code, locale]));

    for (const item of items) {
      const locale = localeByCode.get(item.localeCode);
      if (!locale) {
        throw new Error(
          this.i18n.t(ERROR_KEYS.LOCALE_NOT_FOUND_FOR_CODE) as string,
        );
      }
      const existing = await this.translationRepository.findOne({
        where: {
          palette: { id: palette.id },
          locale: { id: locale.id },
        },
      });
      if (existing) {
        await this.translationRepository.update(existing.id, {
          name: item.name,
        });
      } else {
        await this.translationRepository.save({
          name: item.name,
          palette,
          locale,
        });
      }
    }
  }

  private async clearDefaultPalettes() {
    await this.paletteRepository
      .createQueryBuilder()
      .update(MobileAppThemePalette)
      .set({ isDefault: false })
      .where('isDefault = :isDefault', { isDefault: true })
      .execute();
  }

  private async seedDefaults() {
    const count = await this.paletteRepository.count();
    if (count === 0) {
      for (const seed of SEED_PALETTES) {
        const { label, ...payload } = seed;
        const palette = await this.paletteRepository.save(payload);
        await this.upsertTranslations(palette, [
          { localeCode: 'en', name: label },
          { localeCode: 'ar', name: label },
        ]);
      }
      return;
    }

    await this.seedMissingPaletteTranslations();
  }

  private async seedMissingPaletteTranslations() {
    const locales = await this.localeRepository.find({
      where: { code: In(['en', 'ar']) },
    });
    if (!locales.length) {
      return;
    }

    const palettes = await this.paletteRepository.find({
      relations: TRANSLATION_RELATIONS,
    });
    const labelByCode = new Map(
      SEED_PALETTES.map((palette) => [palette.code, palette.label]),
    );

    for (const palette of palettes) {
      const existingCodes = new Set(
        (palette.translations ?? [])
          .map((translation) => translation.locale?.code)
          .filter(Boolean),
      );
      const fallbackName =
        labelByCode.get(palette.code) ??
        mapTranslationViews(palette.translations)[0]?.name ??
        palette.code;
      const missing = locales
        .filter((locale) => !existingCodes.has(locale.code))
        .map((locale) => ({
          localeCode: locale.code,
          name: fallbackName,
        }));
      if (missing.length) {
        await this.upsertTranslations(palette, missing);
      }
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    );
  }
}
