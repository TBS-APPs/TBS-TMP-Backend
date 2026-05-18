import { OmitType } from '@nestjs/swagger';
import { CreateLicenseDto } from './create-license.dto';

export class CreateLicenseByCompanyDto extends OmitType(CreateLicenseDto, [
  'companyId',
]) {}
