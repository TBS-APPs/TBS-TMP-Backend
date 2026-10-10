import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { EntityTranslationItemDto } from 'src/core/utils/entity-translation';

const HEX_COLOR = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export class CreateMobileAppThemePaletteDto {
  @ApiProperty({ example: 'olive' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  code: string;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ example: '#556B2F' })
  @IsString()
  @IsNotEmpty()
  @Matches(HEX_COLOR)
  primary: string;

  @ApiProperty({ example: '#eba20e' })
  @IsString()
  @IsNotEmpty()
  @Matches(HEX_COLOR)
  secondary: string;

  @ApiProperty({ example: '#7BC3FA' })
  @IsString()
  @IsNotEmpty()
  @Matches(HEX_COLOR)
  tertiary: string;

  @ApiProperty({
    type: [EntityTranslationItemDto],
    example: [
      { localeCode: 'en', name: 'Olive' },
      { localeCode: 'ar', name: 'زيتوني' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EntityTranslationItemDto)
  translations: EntityTranslationItemDto[];
}
