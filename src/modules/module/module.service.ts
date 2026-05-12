import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ModuleEntity from './entities/module.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    try {
      const moduleRecord: ModuleEntity =
        await this.modulesRepository.save(createModuleDto);
      return successResponse({ data: moduleRecord });
    } catch {
      return errorResponse();
    }
  }

  async findAll(): Promise<ApiResponse<ModuleEntity[] | null>> {
    try {
      const modules: ModuleEntity[] = await this.modulesRepository.find();
      return successResponse({ data: modules });
    } catch {
      return errorResponse();
    }
  }

  async findOne(id: number) {
    try {
      const moduleRecord = await this.modulesRepository.findOne({
        where: { id },
      });
      return successResponse({ data: moduleRecord });
    } catch {
      return errorResponse();
    }
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    try {
      const result = await this.modulesRepository.update(id, updateModuleDto);
      return successResponse({ data: result });
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
}
