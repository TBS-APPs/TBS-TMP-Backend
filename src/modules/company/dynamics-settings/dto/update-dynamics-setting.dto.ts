import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicsSettingDto } from './create-dynamics-setting.dto';

export class UpdateDynamicsSettingDto extends PartialType(
  CreateDynamicsSettingDto,
) {}
