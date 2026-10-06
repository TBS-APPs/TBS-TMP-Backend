import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateMobileAppLocaleDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]{2}(-[A-Z]{2})?$/)
  code: string;

  @ApiProperty({ example: 'English' })
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
}
