import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';
import { MobilePlatform } from 'src/core/enums/mobile-platform.enum';

export class CreateMobileAppSettingDto {
  @ApiProperty({
    enum: MobilePlatform,
    example: MobilePlatform.IOS,
  })
  @IsEnum(MobilePlatform)
  @IsNotEmpty()
  platform: MobilePlatform;

  @ApiProperty({
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/)
  minimumVersion: string;

  @ApiProperty({
    example: '1.1.0',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/)
  recommendedVersion: string;

  @ApiProperty({
    example: '1.2.0',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/)
  latestVersion: string;

  @ApiProperty({
    required: false,
    example: 40,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumBuildNumber?: number;

  @ApiProperty({
    required: false,
    example: 45,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  recommendedBuildNumber?: number;

  @ApiProperty({
    required: false,
    example: 'https://apps.apple.com/app/example',
  })
  @IsOptional()
  @IsUrl()
  storeUrl?: string;

  @ApiProperty({
    required: false,
    example: 'Please update to continue using the app.',
  })
  @IsOptional()
  @IsString()
  updateMessage?: string;

  @ApiProperty({
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isMaintenanceModeEnabled?: boolean;

  @ApiProperty({
    required: false,
    example: 'The app is under maintenance. Please try again later.',
  })
  @IsOptional()
  @IsString()
  maintenanceMessage?: string;
}
