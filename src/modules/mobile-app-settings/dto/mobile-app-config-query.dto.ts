import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { MobilePlatform } from 'src/core/enums/mobile-platform.enum';

export class MobileAppConfigQueryDto {
  @ApiProperty({
    enum: MobilePlatform,
    example: MobilePlatform.IOS,
  })
  @IsEnum(MobilePlatform)
  platform: MobilePlatform;

  @ApiProperty({
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/)
  version: string;

  @ApiProperty({
    required: false,
    example: 42,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  build?: number;
}
