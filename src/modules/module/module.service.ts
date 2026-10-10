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
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import ModuleEntity from './entities/module.entity';
import { ModuleTranslation } from './entities/module-translation.entity';

const TRANSLATION_RELATIONS = {
  translations: {
    locale: true,
  },
} as const;

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ModuleTranslation)
    private translationRepository: Repository<ModuleTranslation>,
    @InjectRepository(Locale)
    private localeRepository: Repository<Locale>,
    private readonly i18n: I18nService,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    try {
      const translationError = await this.validateTranslations(
        createModuleDto.translations,
      );
      if (translationError) {
        return translationError;
      }
      const { translations, ...payload } = createModuleDto;
      const moduleRecord = await this.modulesRepository.save(payload);
      await this.upsertTranslations(moduleRecord, translations);
      const saved = await this.findModuleById(moduleRecord.id);
      return successResponse({
        data: await this.toResponse(saved!),
      });
    } catch {
      return errorResponse();
    }
  }

  async findAll(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [modules, defaultLocale] = await Promise.all([
        this.modulesRepository.find({
          relations: TRANSLATION_RELATIONS,
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: modules.map((moduleRecord) =>
          presentTranslatedEntity(
            moduleRecord,
            moduleRecord.translations,
            options,
          ),
        ),
      });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: number, presentOptions: TranslationPresentOptions = {}) {
    try {
      const moduleRecord = await this.findModuleById(id);
      return successResponse({
        data: moduleRecord
          ? await this.toResponse(moduleRecord, presentOptions)
          : null,
      });
    } catch {
      return errorResponse();
    }
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    try {
      const moduleRecord = await this.findModuleById(id);
      if (!moduleRecord) {
        return errorResponse();
      }
      const { translations, ...payload } = updateModuleDto;
      if (translations?.length) {
        const translationError = await this.validateTranslations(translations);
        if (translationError) {
          return translationError;
        }
      }
      if (Object.keys(payload).length) {
        await this.modulesRepository.update(id, payload);
      }
      if (translations?.length) {
        const updatedModule = await this.modulesRepository.findOne({
          where: { id },
        });
        await this.upsertTranslations(updatedModule!, translations);
      }
      const updated = await this.findModuleById(id);
      return successResponse({
        data: await this.toResponse(updated!),
      });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: number) {
    try {
      await this.modulesRepository.delete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  private async toResponse(
    moduleRecord: ModuleEntity,
    presentOptions: TranslationPresentOptions = {},
  ) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    return presentTranslatedEntity(moduleRecord, moduleRecord.translations, {
      ...presentOptions,
      defaultLocaleCode: defaultLocale?.code,
    });
  }

  private async findModuleById(id: number) {
    return this.modulesRepository.findOne({
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
    moduleRecord: ModuleEntity,
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
          module: { id: moduleRecord.id },
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
          module: moduleRecord,
          locale,
        });
      }
    }
  }
}
