import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { EntityTranslationItemDto } from 'src/core/utils/entity-translation';

export class CreateScreenDto {
  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  apiId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  moduleId?: number;

  @ApiProperty({
    type: [EntityTranslationItemDto],
    example: [
      { localeCode: 'en', name: 'Dashboard' },
      { localeCode: 'ar', name: 'لوحة التحكم' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EntityTranslationItemDto)
  translations: EntityTranslationItemDto[];
}
