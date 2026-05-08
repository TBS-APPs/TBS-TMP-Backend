import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLicenseDto {
  @IsNotEmpty()
  @IsNumber()
  seatsLimit: number;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  moduleId: number;
}
