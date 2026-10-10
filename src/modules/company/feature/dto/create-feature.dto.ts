import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { EntityTranslationItemDto } from 'src/core/utils/entity-translation';

export class CreateFeatureDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  companyId: number;

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
