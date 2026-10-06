import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMobileAppTranslationKeyDto } from './create-mobile-app-translation-key.dto';

export class UpdateMobileAppTranslationKeyDto extends PartialType(
  OmitType(CreateMobileAppTranslationKeyDto, ['key']),
) {}
