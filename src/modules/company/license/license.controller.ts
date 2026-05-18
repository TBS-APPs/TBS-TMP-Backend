import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { CreateLicenseByCompanyDto } from './dto/create-license-by-company.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { UpdateLicenseByCompanyDto } from './dto/update-license-by-company.dto';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post()
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licenseService.create(createLicenseDto);
  }

  @Get()
  findAll() {
    return this.licenseService.findAll();
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.licenseService.findByCompanyId(companyId);
  }

  @Post('company/:companyId')
  createByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() createLicenseByCompanyDto: CreateLicenseByCompanyDto,
  ) {
    return this.licenseService.createByCompanyId(
      companyId,
      createLicenseByCompanyDto,
    );
  }

  @Patch('company/:companyId/:licenseId')
  updateByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('licenseId', ParseIntPipe) licenseId: number,
    @Body() updateLicenseByCompanyDto: UpdateLicenseByCompanyDto,
  ) {
    return this.licenseService.updateByCompanyId(
      companyId,
      licenseId,
      updateLicenseByCompanyDto,
    );
  }

  @Delete('company/:companyId/:licenseId')
  removeByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('licenseId', ParseIntPipe) licenseId: number,
  ) {
    return this.licenseService.removeByCompanyId(companyId, licenseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(+id, updateLicenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenseService.remove(+id);
  }
}
