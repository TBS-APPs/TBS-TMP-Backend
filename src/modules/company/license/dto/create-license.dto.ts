import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLicenseDto {
  @IsNotEmpty()
  @IsNumber()
  seatsLimit: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  moduleId: number;

  @IsNotEmpty()
  @IsNumber()
  companyId: number;
}
