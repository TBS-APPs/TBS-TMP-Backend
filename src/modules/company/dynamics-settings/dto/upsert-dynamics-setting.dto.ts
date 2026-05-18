import { OmitType } from '@nestjs/swagger';
import { CreateDynamicsSettingDto } from './create-dynamics-setting.dto';

export class UpsertDynamicsSettingDto extends OmitType(
  CreateDynamicsSettingDto,
  ['companyId'],
) {}
