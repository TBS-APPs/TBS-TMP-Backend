import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const HEX_COLOR = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export class CreateMobileAppThemePaletteDto {
  @ApiProperty({ example: 'olive' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  code: string;

  @ApiProperty({ example: 'Olive' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
}
