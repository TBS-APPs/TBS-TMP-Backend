import { PartialType } from '@nestjs/swagger';
import { CreateDynamicsSettingDto } from './create-dynamics-setting.dto';

export class UpdateDynamicsSettingDto extends PartialType(
  CreateDynamicsSettingDto,
) {}
