import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpsertMobileAppTranslationDto {
  @ApiProperty({ example: 'about' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
  key: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]{2}(-[A-Z]{2})?$/)
  localeCode: string;

  @ApiProperty({ example: 'About' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
