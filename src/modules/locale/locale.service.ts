import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { QueryFailedError, Repository } from 'typeorm';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { Locale } from './entities/locale.entity';

@Injectable()
export class LocaleService implements OnModuleInit {
  constructor(
    @InjectRepository(Locale)
    private readonly localeRepository: Repository<Locale>,
    private readonly i18n: I18nService,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async create(dto: CreateLocaleDto) {
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

  async findAll() {
    try {
      const locales = await this.localeRepository.find({
        order: { isDefault: 'DESC', code: 'ASC' },
      });
      return successResponse({ data: locales });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.LOCALE_NOT_FOUND),
        });
      }
      return successResponse({ data: locale });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, dto: UpdateLocaleDto) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.LOCALE_NOT_FOUND),
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

  async remove(id: string) {
    try {
      const locale = await this.localeRepository.findOne({ where: { id } });
      if (!locale) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.LOCALE_NOT_FOUND),
        });
      }
      if (locale.isDefault) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.CANNOT_DELETE_DEFAULT_LOCALE),
        });
      }
      await this.localeRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  private async seedDefaults() {
    const count = await this.localeRepository.count();
    if (count > 0) {
      return;
    }

    await this.localeRepository.save([
      {
        code: 'en',
        name: 'English',
        isDefault: true,
        isActive: true,
      },
      {
        code: 'ar',
        name: 'Arabic',
        isDefault: false,
        isActive: true,
      },
    ]);
  }

  private async clearDefaultLocales() {
    await this.localeRepository
      .createQueryBuilder()
      .update(Locale)
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
