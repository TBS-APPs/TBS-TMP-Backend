import { PartialType } from '@nestjs/swagger';
import { CreateLicenseByCompanyDto } from './create-license-by-company.dto';

export class UpdateLicenseByCompanyDto extends PartialType(
  CreateLicenseByCompanyDto,
) {}
