import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMobileAppLocaleDto } from './create-mobile-app-locale.dto';

export class UpdateMobileAppLocaleDto extends PartialType(
  OmitType(CreateMobileAppLocaleDto, ['code']),
) {}
