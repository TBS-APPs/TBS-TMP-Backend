import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { QueryFailedError, Repository } from 'typeorm';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { CreateMobileAppThemePaletteDto } from './dto/create-mobile-app-theme-palette.dto';
import { UpdateMobileAppThemePaletteDto } from './dto/update-mobile-app-theme-palette.dto';
import { MobileAppThemePalette } from './entities/mobile-app-theme-palette.entity';

export interface MobileAppThemePalettePublic {
  code: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  primary: string;
  secondary: string;
  tertiary: string;
}

@Injectable()
export class MobileAppThemesService implements OnModuleInit {
  constructor(
    @InjectRepository(MobileAppThemePalette)
    private readonly paletteRepository: Repository<MobileAppThemePalette>,
    private readonly i18n: I18nService,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async create(dto: CreateMobileAppThemePaletteDto) {
    try {
      if (dto.isDefault) {
        await this.clearDefaultPalettes();
      }
      const palette = await this.paletteRepository.save(dto);
      return successResponse({ data: palette });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.THEME_PALETTE_CODE_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAll() {
    try {
      const palettes = await this.paletteRepository.find({
        order: { sortOrder: 'ASC', id: 'ASC' },
      });
      return successResponse({ data: palettes });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: number) {
    try {
      const palette = await this.paletteRepository.findOne({ where: { id } });
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      return successResponse({ data: palette });
    } catch {
      return errorResponse();
    }
  }

  async update(id: number, dto: UpdateMobileAppThemePaletteDto) {
    try {
      const palette = await this.paletteRepository.findOne({ where: { id } });
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      if (dto.isDefault) {
        await this.clearDefaultPalettes();
      }
      await this.paletteRepository.update(id, dto);
      const updated = await this.paletteRepository.findOne({ where: { id } });
      return successResponse({ data: updated });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: number) {
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

  async listActivePalettes() {
    try {
      const palettes = await this.paletteRepository.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC', id: 'ASC' },
      });
      return successResponse({
        data: palettes.map((palette) => this.toPublic(palette)),
      });
    } catch {
      return errorResponse();
    }
  }

  async getActivePaletteByCode(code: string) {
    try {
      const palette = await this.paletteRepository.findOne({
        where: { code, isActive: true },
      });
      if (!palette) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_THEME_PALETTE_NOT_FOUND),
        });
      }
      return successResponse({ data: this.toPublic(palette) });
    } catch {
      return errorResponse();
    }
  }

  private toPublic(palette: MobileAppThemePalette): MobileAppThemePalettePublic {
    return {
      code: palette.code,
      name: palette.name,
      isDefault: palette.isDefault,
      sortOrder: palette.sortOrder,
      primary: palette.primary,
      secondary: palette.secondary,
      tertiary: palette.tertiary,
    };
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
    if (count > 0) {
      return;
    }

    await this.paletteRepository.save([
      {
        code: 'olive',
        name: 'Olive',
        isDefault: true,
        isActive: true,
        sortOrder: 0,
        primary: '#556B2F',
        secondary: '#eba20e',
        tertiary: '#7BC3FA',
      },
      {
        code: 'navy',
        name: 'Navy',
        isDefault: false,
        isActive: true,
        sortOrder: 1,
        primary: '#00599C',
        secondary: '#2259BF',
        tertiary: '#DAE9F8',
      },
      {
        code: 'metallicGold',
        name: 'Metallic Gold',
        isDefault: false,
        isActive: true,
        sortOrder: 2,
        primary: '#D4AF37',
        secondary: '#8B1E3F',
        tertiary: '#F9F3E1',
      },
      {
        code: 'blueSpruce',
        name: 'Blue Spruce',
        isDefault: false,
        isActive: true,
        sortOrder: 3,
        primary: '#00796B',
        secondary: '#FF7043',
        tertiary: '#D9EBE9',
      },
      {
        code: 'pacificBlue',
        name: 'Pacific Blue',
        isDefault: false,
        isActive: true,
        sortOrder: 4,
        primary: '#00ACC1',
        secondary: '#6A1B9A',
        tertiary: '#D9F3F6',
      },
    ]);
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    );
  }
}
