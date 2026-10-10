import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDynamicsSettingDto {
  @IsNotEmpty()
  baseUrl: string;

  @IsNotEmpty()
  tokenUrl: string;

  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  clientSecret: string;

  @IsNotEmpty()
  tenantId: string;

  @IsNotEmpty()
  resource: string;

  @IsNotEmpty()
  @IsUUID('4')
  companyId: string;
}
