import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMobileAppTranslationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  translationKeyId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  localeId: number;

  @ApiProperty({ example: 'About' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
