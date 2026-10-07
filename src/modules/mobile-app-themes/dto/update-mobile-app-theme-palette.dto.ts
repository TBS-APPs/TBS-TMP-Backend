import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMobileAppThemePaletteDto } from './create-mobile-app-theme-palette.dto';

export class UpdateMobileAppThemePaletteDto extends PartialType(
  OmitType(CreateMobileAppThemePaletteDto, ['code']),
) {}
