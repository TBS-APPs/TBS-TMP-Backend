import { PartialType } from '@nestjs/swagger';
import { CreateMobileAppSettingDto } from './create-mobile-app-setting.dto';

export class UpdateMobileAppSettingDto extends PartialType(CreateMobileAppSettingDto) {}
