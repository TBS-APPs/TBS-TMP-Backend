import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateMobileAppTranslationKeyDto {
  @ApiProperty({ example: 'about' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
  key: string;

  @ApiProperty({ required: false, example: 'About screen title' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: {
      placeholders: {
        count: { type: 'int' },
      },
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
