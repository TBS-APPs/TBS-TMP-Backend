import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FindCompanyDetailDto } from './dto/find-company-detail.dto';
import { errorResponse } from 'src/core/utils/transform/transform.interceptor';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get('detail')
  findDetail(@Query() query: FindCompanyDetailDto) {
    const { id, alias } = query;
    const hasId = id !== undefined;
    const hasAlias = alias !== undefined;

    if (hasId === hasAlias) {
      return errorResponse({ message: 'Provide exactly one of id or alias' });
    }

    if (hasId) {
      return this.companyService.findOneWithDetails({ id });
    }

    if (alias === undefined) {
      return errorResponse({ message: 'Provide exactly one of id or alias' });
    }

    return this.companyService.findOneWithDetails({ alias });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
