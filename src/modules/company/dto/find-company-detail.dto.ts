import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindCompanyDetailDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alias?: string;

  @IsOptional()
  @IsString()
  include?: string;
}
