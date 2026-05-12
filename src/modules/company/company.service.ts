import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company: Company =
        await this.companiesRepository.save(createCompanyDto);
      return successResponse({ data: company });
    } catch {
      return errorResponse();
    }
  }

  async findAll(): Promise<ApiResponse<Company[] | null>> {
    try {
      const companies: Company[] = await this.companiesRepository.find();
      return successResponse({ data: companies });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: number) {
    try {
      const company = await this.companiesRepository.findOne({
        where: { id },
      });
      return successResponse({ data: company });
    } catch {
      return errorResponse();
    }
  }

  async findOneWithDetails(where: { id: number } | { alias: string }) {
    try {
      const company = await this.companiesRepository.findOne({
        where,
        relations: ['dynamicsSettings', 'licenses', 'licenses.module'],
      });
      return successResponse({ data: company });
    } catch {
      return errorResponse();
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.companiesRepository.update(
        id,
        updateCompanyDto,
      );
      return successResponse({ data: company });
    } catch {
      return errorResponse();
    }
  }

  async remove(id: number) {
    try {
      await this.companiesRepository.softDelete(id);
      return successResponse();
    } catch {
      return errorResponse();
    }
  }
}
