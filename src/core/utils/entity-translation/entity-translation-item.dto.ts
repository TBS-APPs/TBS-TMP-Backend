import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EntityTranslationItemDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]{2}(-[A-Z]{2})?$/)
  localeCode: string;

  @ApiProperty({ example: 'Olive' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
