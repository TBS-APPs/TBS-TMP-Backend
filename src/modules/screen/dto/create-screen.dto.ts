import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
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

  @ApiProperty({
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  moduleId?: string;

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
