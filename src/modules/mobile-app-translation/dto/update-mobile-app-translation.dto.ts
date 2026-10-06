import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMobileAppTranslationDto {
  @ApiProperty({ example: 'About' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
