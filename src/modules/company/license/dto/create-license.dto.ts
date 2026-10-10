import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

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
  @IsUUID('4')
  moduleId: string;
  
  @IsNotEmpty()
  @IsUUID('4')
  companyId: string;
}
