import { Injectable } from '@nestjs/common';
import { CreateDynamicsSettingDto } from './dto/create-dynamics-setting.dto';
import { UpdateDynamicsSettingDto } from './dto/update-dynamics-setting.dto';
import { UpsertDynamicsSettingDto } from './dto/upsert-dynamics-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DynamicsSetting from './entities/dynamics-setting.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';

@Injectable()
export class DynamicsSettingsService {
  constructor(
    @InjectRepository(DynamicsSetting)
    private dynamicsSettingsRepository: Repository<DynamicsSetting>,
  ) {}

  async create(createDynamicsSettingDto: CreateDynamicsSettingDto) {
    try {
      const { companyId, ...fields } = createDynamicsSettingDto;
      const dynamicsSetting = await this.dynamicsSettingsRepository.save({
        ...fields,
        company: { id: companyId },
      });
      return successResponse({ data: dynamicsSetting });
    } catch {
      return errorResponse();
    }
  }

  async findAll(): Promise<ApiResponse<DynamicsSetting[] | null>> {
    try {
      const dynamicsSettings: DynamicsSetting[] =
        await this.dynamicsSettingsRepository.find();
      return successResponse({ data: dynamicsSettings });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: string) {
    try {
      const dynamicsSetting = await this.dynamicsSettingsRepository.findOne({
        where: { id },
      });
      return successResponse({ data: dynamicsSetting });
    } catch {
      return errorResponse();
    }
  }

  async findByCompanyId(companyId: string) {
    try {
      const dynamicsSetting = await this.dynamicsSettingsRepository.findOne({
        where: { company: { id: companyId } },
      });
      return successResponse({ data: dynamicsSetting });
    } catch {
      return errorResponse();
    }
  }

  async upsertByCompanyId(
    companyId: string,
    upsertDynamicsSettingDto: UpsertDynamicsSettingDto,
  ) {
    try {
      const existing = await this.dynamicsSettingsRepository.findOne({
        where: { company: { id: companyId } },
      });

      const dynamicsSetting = await this.dynamicsSettingsRepository.save({
        ...upsertDynamicsSettingDto,
        ...(existing ? { id: existing.id } : {}),
        company: { id: companyId },
      });

      return successResponse({ data: dynamicsSetting });
    } catch {
      return errorResponse();
    }
  }

  async update(id: string, updateDynamicsSettingDto: UpdateDynamicsSettingDto) {
    try {
      const { companyId, ...rest } = updateDynamicsSettingDto;
      const payload =
        companyId !== undefined ? { ...rest, companyId } : { ...rest };
      const dynamicsSetting = await this.dynamicsSettingsRepository.update(
        id,
        payload,
      );
      return successResponse({ data: dynamicsSetting });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: string) {
    try {
      await this.dynamicsSettingsRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }
}
