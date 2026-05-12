import { Injectable } from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from './entities/license.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licensesRepository: Repository<License>,
  ) {}

  async create(createLicenseDto: CreateLicenseDto) {
    try {
      const { moduleId, companyId, seatsLimit, startDate, expirationDate } =
        createLicenseDto;
      const license = await this.licensesRepository.save({
        seatsLimit,
        startDate,
        expirationDate,
        module: { id: moduleId },
        company: { id: companyId },
      });
      return successResponse({ data: license });
    } catch {
      return errorResponse();
    }
  }

  async findAll(): Promise<ApiResponse<License[] | null>> {
    try {
      const licenses: License[] = await this.licensesRepository.find();
      return successResponse({ data: licenses });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: number) {
    try {
      const license = await this.licensesRepository.findOne({
        where: { id },
      });
      return successResponse({ data: license });
    } catch {
      return errorResponse();
    }
  }

  async update(id: number, updateLicenseDto: UpdateLicenseDto) {
    try {
      const { moduleId, companyId, ...rest } = updateLicenseDto;
      const payload = {
        ...rest,
        ...(moduleId !== undefined ? { moduleId } : {}),
        ...(companyId !== undefined ? { companyId } : {}),
      };
      const license = await this.licensesRepository.update(id, payload);
      return successResponse({ data: license });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: number) {
    try {
      await this.licensesRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }
}
