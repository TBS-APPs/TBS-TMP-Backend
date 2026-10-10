import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { In, Repository } from 'typeorm';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import {
  EntityTranslationItem,
  getDefaultLocale,
  hasDefaultLocaleTranslation,
  presentTranslatedEntity,
  TranslationPresentOptions,
} from 'src/core/utils/entity-translation';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import ModuleEntity from 'src/modules/module/entities/module.entity';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { Screen } from './entities/screen.entity';
import { ScreenTranslation } from './entities/screen-translation.entity';

const TRANSLATION_RELATIONS = {
  translations: {
    locale: true,
  },
  module: true,
} as const;

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
    @InjectRepository(ScreenTranslation)
    private readonly translationRepository: Repository<ScreenTranslation>,
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    private readonly i18n: I18nService,
  ) {}

  async create(createScreenDto: CreateScreenDto) {
    try {
      const translationError = await this.validateTranslations(
        createScreenDto.translations,
      );
      if (translationError) {
        return translationError;
      }
      const { translations, moduleId, ...payload } = createScreenDto;
      let moduleRecord: ModuleEntity | undefined;
      if (moduleId != null) {
        const found = await this.moduleRepository.findOne({
          where: { id: moduleId },
        });
        if (!found) {
          return errorResponse();
        }
        moduleRecord = found;
      }
      const screen = await this.screenRepository.save({
        ...payload,
        module: moduleRecord,
      });
      await this.upsertTranslations(screen, translations);
      const saved = await this.findScreenById(screen.id);
      return successResponse({
        data: await this.toResponse(saved!),
      });
    } catch {
      return errorResponse();
    }
  }

  async findAll(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [screens, defaultLocale] = await Promise.all([
        this.screenRepository.find({
          relations: TRANSLATION_RELATIONS,
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: screens.map((screen) =>
          presentTranslatedEntity(screen, screen.translations, options),
        ),
      });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string, presentOptions: TranslationPresentOptions = {}) {
    try {
      const screen = await this.findScreenById(id);
      return successResponse({
        data: screen ? await this.toResponse(screen, presentOptions) : null,
      });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, updateScreenDto: UpdateScreenDto) {
    try {
      const screen = await this.findScreenById(id);
      if (!screen) {
        return errorResponse();
      }
      const { translations, moduleId, ...payload } = updateScreenDto;
      if (translations?.length) {
        const translationError = await this.validateTranslations(translations);
        if (translationError) {
          return translationError;
        }
      }
      if (moduleId != null) {
        const moduleRecord = await this.moduleRepository.findOne({
          where: { id: moduleId },
        });
        if (!moduleRecord) {
          return errorResponse();
        }
        screen.module = moduleRecord;
      }
      Object.assign(screen, payload);
      await this.screenRepository.save(screen);
      if (translations?.length) {
        await this.upsertTranslations(screen, translations);
      }
      const updated = await this.findScreenById(id);
      return successResponse({
        data: await this.toResponse(updated!),
      });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      await this.screenRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  private async toResponse(
    screen: Screen,
    presentOptions: TranslationPresentOptions = {},
  ) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    return presentTranslatedEntity(screen, screen.translations, {
      ...presentOptions,
      defaultLocaleCode: defaultLocale?.code,
    });
  }

  private async findScreenById(id: string) {
    return this.screenRepository.findOne({
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
    screen: Screen,
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
          screen: { id: screen.id },
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
          screen,
          locale,
        });
      }
    }
  }
}
