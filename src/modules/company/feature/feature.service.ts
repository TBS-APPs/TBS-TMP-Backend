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
import { Company } from '../entities/company.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Feature } from './entities/feature.entity';
import { FeatureTranslation } from './entities/feature-translation.entity';

const TRANSLATION_RELATIONS = {
  translations: {
    locale: true,
  },
  company: true,
} as const;

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(FeatureTranslation)
    private readonly translationRepository: Repository<FeatureTranslation>,
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly i18n: I18nService,
  ) {}

  async create(createFeatureDto: CreateFeatureDto) {
    try {
      const translationError = await this.validateTranslations(
        createFeatureDto.translations,
      );
      if (translationError) {
        return translationError;
      }
      const { translations, companyId } = createFeatureDto;
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        return errorResponse();
      }
      const feature = await this.featureRepository.save({ company });
      await this.upsertTranslations(feature, translations);
      const saved = await this.findFeatureById(feature.id);
      return successResponse({
        data: await this.toResponse(saved!),
      });
    } catch {
      return errorResponse();
    }
  }

  async findAll(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [features, defaultLocale] = await Promise.all([
        this.featureRepository.find({
          relations: TRANSLATION_RELATIONS,
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: features.map((feature) =>
          presentTranslatedEntity(feature, feature.translations, options),
        ),
      });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string, presentOptions: TranslationPresentOptions = {}) {
    try {
      const feature = await this.findFeatureById(id);
      return successResponse({
        data: feature ? await this.toResponse(feature, presentOptions) : null,
      });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, updateFeatureDto: UpdateFeatureDto) {
    try {
      const feature = await this.findFeatureById(id);
      if (!feature) {
        return errorResponse();
      }
      const { translations, companyId } = updateFeatureDto;
      if (translations?.length) {
        const translationError = await this.validateTranslations(translations);
        if (translationError) {
          return translationError;
        }
      }
      if (companyId != null) {
        const company = await this.companyRepository.findOne({
          where: { id: companyId },
        });
        if (!company) {
          return errorResponse();
        }
        feature.company = company;
        await this.featureRepository.save(feature);
      }
      if (translations?.length) {
        await this.upsertTranslations(feature, translations);
      }
      const updated = await this.findFeatureById(id);
      return successResponse({
        data: await this.toResponse(updated!),
      });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      await this.featureRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  private async toResponse(
    feature: Feature,
    presentOptions: TranslationPresentOptions = {},
  ) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    return presentTranslatedEntity(feature, feature.translations, {
      ...presentOptions,
      defaultLocaleCode: defaultLocale?.code,
    });
  }

  private async findFeatureById(id: string) {
    return this.featureRepository.findOne({
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
    feature: Feature,
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
          feature: { id: feature.id },
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
          feature,
          locale,
        });
      }
    }
  }
}
