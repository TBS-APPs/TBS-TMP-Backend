import { Injectable } from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { CreateLicenseByCompanyDto } from './dto/create-license-by-company.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { UpdateLicenseByCompanyDto } from './dto/update-license-by-company.dto';
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

  private findLicenseForCompany(companyId: number, licenseId: number) {
    return this.licensesRepository.findOne({
      where: { id: licenseId, company: { id: companyId } },
      relations: ['module'],
    });
  }

  async findByCompanyId(companyId: number) {
    try {
      const licenses = await this.licensesRepository.find({
        where: { company: { id: companyId } },
        relations: ['module'],
      });
      return successResponse({ data: licenses });
    } catch {
      return errorResponse();
    }
  }

  async createByCompanyId(
    companyId: number,
    createLicenseByCompanyDto: CreateLicenseByCompanyDto,
  ) {
    try {
      const { moduleId, seatsLimit, startDate, expirationDate } =
        createLicenseByCompanyDto;
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

  async updateByCompanyId(
    companyId: number,
    licenseId: number,
    updateLicenseByCompanyDto: UpdateLicenseByCompanyDto,
  ) {
    try {
      const existing = await this.findLicenseForCompany(companyId, licenseId);
      if (!existing) {
        return errorResponse();
      }

      const { moduleId, ...rest } = updateLicenseByCompanyDto;
      const license = await this.licensesRepository.save({
        id: existing.id,
        ...rest,
        ...(moduleId !== undefined ? { module: { id: moduleId } } : {}),
        company: { id: companyId },
      });
      return successResponse({ data: license });
    } catch {
      return errorResponse();
    }
  }

  async removeByCompanyId(companyId: number, licenseId: number) {
    try {
      const existing = await this.findLicenseForCompany(companyId, licenseId);
      if (!existing) {
        return errorResponse();
      }

      await this.licensesRepository.softDelete(licenseId);
      return successResponse();
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
