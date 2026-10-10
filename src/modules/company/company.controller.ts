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
import { I18nService } from 'nestjs-i18n';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FindCompanyDetailDto } from './dto/find-company-detail.dto';
import { errorResponse } from 'src/core/utils/transform/transform.interceptor';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query('include') include?: string) {
    return this.companyService.findAll({ include });
  }

  @Get('details')
  findDetail(@Query() query: FindCompanyDetailDto) {
    const { id, alias, include } = query;
    const hasId = id !== undefined;
    const hasAlias = alias !== undefined;

    if (hasId === hasAlias) {
      return errorResponse({
        message: this.i18n.t(ERROR_KEYS.PROVIDE_EXACTLY_ONE_OF_ID_OR_ALIAS),
      });
    }

    if (hasId && id !== undefined) {
      return this.companyService.findOneWithDetails({ id }, { include });
    }

    return this.companyService.findOneWithDetails(
      { alias: alias as string },
      { include },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('include') include?: string) {
    return this.companyService.findOne(id, { include });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
