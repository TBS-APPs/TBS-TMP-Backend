import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return await this.companiesRepository.save(createCompanyDto);
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find();
  }

  async findOne(id: number) {
    return await this.companiesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return await this.companiesRepository.update(id, updateCompanyDto);
  }

  async remove(id: number) {
    return await this.companiesRepository.softDelete(id);
  }
}
