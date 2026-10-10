import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { EntityTranslationItemDto } from 'src/core/utils/entity-translation';

export class CreateFeatureDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4')
  companyId: string;

  @ApiProperty({
    type: [EntityTranslationItemDto],
    example: [
      { localeCode: 'en', name: 'Reporting' },
      { localeCode: 'ar', name: 'التقارير' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EntityTranslationItemDto)
  translations: EntityTranslationItemDto[];
}
