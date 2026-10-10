import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLocaleDto } from './create-locale.dto';

export class UpdateLocaleDto extends PartialType(
  OmitType(CreateLocaleDto, ['code']),
) {}
