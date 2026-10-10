import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
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
  findBycompanyId(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return this.licenseService.findBycompanyId(companyId);
  }

  @Post('company/:companyId')
  createBycompanyId(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() createLicenseByCompanyDto: CreateLicenseByCompanyDto,
  ) {
    return this.licenseService.createBycompanyId(
      companyId,
      createLicenseByCompanyDto,
    );
  }

  @Patch('company/:companyId/:licenseId')
  updateBycompanyId(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('licenseId', ParseUUIDPipe) licenseId: string,
    @Body() updateLicenseByCompanyDto: UpdateLicenseByCompanyDto,
  ) {
    return this.licenseService.updateBycompanyId(
      companyId,
      licenseId,
      updateLicenseByCompanyDto,
    );
  }

  @Delete('company/:companyId/:licenseId')
  removeBycompanyId(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('licenseId', ParseUUIDPipe) licenseId: string,
  ) {
    return this.licenseService.removeBycompanyId(companyId, licenseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(id, updateLicenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenseService.remove(id);
  }
}
