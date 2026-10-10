import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { QueryFailedError, Repository } from 'typeorm';
import { AppUpdateStatus } from 'src/core/enums/app-update-status.enum';
import { MobilePlatform } from 'src/core/enums/mobile-platform.enum';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { CreateMobileAppSettingDto } from './dto/create-mobile-app-setting.dto';
import { MobileAppConfigQueryDto } from './dto/mobile-app-config-query.dto';
import { UpdateMobileAppSettingDto } from './dto/update-mobile-app-setting.dto';
import { MobileAppSetting } from './entities/mobile-app-setting.entity';

export interface MobileAppConfigResponse {
  updateStatus: AppUpdateStatus;
  isMaintenanceModeEnabled: boolean;
  maintenanceMessage: string | null;
  minimumVersion: string;
  recommendedVersion: string;
  latestVersion: string;
  minimumBuildNumber: number | null;
  recommendedBuildNumber: number | null;
  storeUrl: string | null;
  updateMessage: string | null;
}

@Injectable()
export class MobileAppSettingsService {
  constructor(
    @InjectRepository(MobileAppSetting)
    private mobileAppSettingsRepository: Repository<MobileAppSetting>,
    private readonly i18n: I18nService,
  ) {}

  async create(createMobileAppSettingDto: CreateMobileAppSettingDto) {
    try {
      const setting = await this.mobileAppSettingsRepository.save(
        createMobileAppSettingDto,
      );
      return successResponse({ data: setting });
    } catch (error) {
      if (this.isUniquePlatformViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.PLATFORM_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async findAll(): Promise<ApiResponse<MobileAppSetting[] | null>> {
    try {
      const settings = await this.mobileAppSettingsRepository.find();
      return successResponse({ data: settings });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string) {
    try {
      const setting = await this.mobileAppSettingsRepository.findOne({
        where: { id },
      });
      return successResponse({ data: setting });
    } catch {
      return errorResponse();
    }
  }

  async findByPlatform(platform: MobilePlatform) {
    try {
      const setting = await this.findSettingByPlatform(platform);
      if (!setting) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_SETTING_NOT_FOUND),
        });
      }
      return successResponse({ data: setting });
    } catch {
      return errorResponse();
    }
  }

  async update(
    id: string,
    updateMobileAppSettingDto: UpdateMobileAppSettingDto,
  ) {
    try {
      await this.mobileAppSettingsRepository.update(
        id,
        updateMobileAppSettingDto,
      );
      const setting = await this.mobileAppSettingsRepository.findOne({
        where: { id },
      });
      return successResponse({ data: setting });
    } catch (error) {
      if (this.isUniquePlatformViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.PLATFORM_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async updateByPlatform(
    platform: MobilePlatform,
    updateMobileAppSettingDto: UpdateMobileAppSettingDto,
  ) {
    try {
      const existing = await this.findSettingByPlatform(platform);
      if (!existing) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_SETTING_NOT_FOUND),
        });
      }
      await this.mobileAppSettingsRepository.update(
        existing.id,
        updateMobileAppSettingDto,
      );
      const setting = await this.mobileAppSettingsRepository.findOne({
        where: { id: existing.id },
      });
      return successResponse({ data: setting });
    } catch (error) {
      if (this.isUniquePlatformViolation(error)) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.PLATFORM_ALREADY_EXISTS),
        });
      }
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      await this.mobileAppSettingsRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }

  async getConfig(
    query: MobileAppConfigQueryDto,
  ): Promise<ApiResponse<MobileAppConfigResponse | null>> {
    try {
      const setting = await this.findSettingByPlatform(query.platform);
      if (!setting) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.MOBILE_APP_SETTING_NOT_FOUND),
        });
      }

      return successResponse({
        data: {
          updateStatus: this.resolveUpdateStatus(setting, query),
          isMaintenanceModeEnabled: setting.isMaintenanceModeEnabled,
          maintenanceMessage: setting.maintenanceMessage ?? null,
          minimumVersion: setting.minimumVersion,
          recommendedVersion: setting.recommendedVersion,
          latestVersion: setting.latestVersion,
          minimumBuildNumber: setting.minimumBuildNumber ?? null,
          recommendedBuildNumber: setting.recommendedBuildNumber ?? null,
          storeUrl: setting.storeUrl ?? null,
          updateMessage: setting.updateMessage ?? null,
        },
      });
    } catch {
      return errorResponse();
    }
  }

  private async findSettingByPlatform(platform: MobilePlatform) {
    return this.mobileAppSettingsRepository.findOne({
      where: { platform },
    });
  }

  private resolveUpdateStatus(
    setting: MobileAppSetting,
    query: MobileAppConfigQueryDto,
  ): AppUpdateStatus {
    if (setting.isMaintenanceModeEnabled) {
      return AppUpdateStatus.MAINTENANCE;
    }

    if (
      query.build != null &&
      setting.minimumBuildNumber != null &&
      query.build < setting.minimumBuildNumber
    ) {
      return AppUpdateStatus.REQUIRED_UPDATE;
    }

    if (this.compareSemver(query.version, setting.minimumVersion) < 0) {
      return AppUpdateStatus.REQUIRED_UPDATE;
    }

    if (
      query.build != null &&
      setting.recommendedBuildNumber != null &&
      query.build < setting.recommendedBuildNumber
    ) {
      return AppUpdateStatus.OPTIONAL_UPDATE;
    }

    if (this.compareSemver(query.version, setting.recommendedVersion) < 0) {
      return AppUpdateStatus.OPTIONAL_UPDATE;
    }

    return AppUpdateStatus.UP_TO_DATE;
  }

  private compareSemver(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
      if (diff !== 0) {
        return diff;
      }
    }

    return 0;
  }

  private isUniquePlatformViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    );
  }
}
