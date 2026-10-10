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
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyTranslation } from './entities/company-translation.entity';

const TRANSLATION_RELATIONS = {
  translations: {
    locale: true,
  },
} as const;

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(CompanyTranslation)
    private translationRepository: Repository<CompanyTranslation>,
    @InjectRepository(Locale)
    private localeRepository: Repository<Locale>,
    private readonly i18n: I18nService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const translationError = await this.validateTranslations(
        createCompanyDto.translations,
      );
      if (translationError) {
        return translationError;
      }
      const { translations, ...payload } = createCompanyDto;
      const company = await this.companiesRepository.save(payload);
      await this.upsertTranslations(company, translations);
      const saved = await this.findCompanyById(company.id);
      return successResponse({
        data: await this.toResponse(saved!),
      });
    } catch {
      return errorResponse();
    }
  }

  async findAll(presentOptions: TranslationPresentOptions = {}) {
    try {
      const [companies, defaultLocale] = await Promise.all([
        this.companiesRepository.find({
          relations: TRANSLATION_RELATIONS,
        }),
        getDefaultLocale(this.localeRepository),
      ]);
      const options = {
        ...presentOptions,
        defaultLocaleCode: defaultLocale?.code,
      };
      return successResponse({
        data: companies.map((company) =>
          presentTranslatedEntity(company, company.translations, options),
        ),
      });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string, presentOptions: TranslationPresentOptions = {}) {
    try {
      const company = await this.findCompanyById(id);
      return successResponse({
        data: company ? await this.toResponse(company, presentOptions) : null,
      });
    } catch {
      return errorResponse();
    }
  }

  async findOneWithDetails(
    where: { id: string } | { alias: string },
    presentOptions: TranslationPresentOptions = {},
  ) {
    try {
      const company = await this.companiesRepository.findOne({
        where,
        relations: {
          dynamicsSettings: true,
          licenses: {
            module: true,
          },
          translations: {
            locale: true,
          },
        },
      });
      return successResponse({
        data: company ? await this.toResponse(company, presentOptions) : null,
      });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.findCompanyById(id);
      if (!company) {
        return errorResponse();
      }
      const { translations, ...payload } = updateCompanyDto;
      if (translations?.length) {
        const translationError = await this.validateTranslations(translations);
        if (translationError) {
          return translationError;
        }
      }
      if (Object.keys(payload).length) {
        await this.companiesRepository.update(id, payload);
      }
      if (translations?.length) {
        const updatedCompany = await this.companiesRepository.findOne({
          where: { id },
        });
        await this.upsertTranslations(updatedCompany!, translations);
      }
      const updated = await this.findCompanyById(id);
      return successResponse({
        data: await this.toResponse(updated!),
      });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      await this.companiesRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  private async toResponse(
    company: Company,
    presentOptions: TranslationPresentOptions = {},
  ) {
    const defaultLocale = await getDefaultLocale(this.localeRepository);
    return presentTranslatedEntity(company, company.translations, {
      ...presentOptions,
      defaultLocaleCode: defaultLocale?.code,
    });
  }

  private async findCompanyById(id: string) {
    return this.companiesRepository.findOne({
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
    company: Company,
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
          company: { id: company.id },
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
          company,
          locale,
        });
      }
    }
  }
}
