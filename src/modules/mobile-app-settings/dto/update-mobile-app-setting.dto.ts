import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMobileAppSettingDto } from './create-mobile-app-setting.dto';

export class UpdateMobileAppSettingDto extends PartialType(
  OmitType(CreateMobileAppSettingDto, ['platform']),
) {}
