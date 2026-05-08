import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  alias: string;

  // @ValidateNested()
  // @Type(() => CreateDynamicsSettingDto)
  // dynamicsSettings: CreateDynamicsSettingDto;
}
