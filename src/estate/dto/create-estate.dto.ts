import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateEstateDto {
  @IsString()
  name!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsNumber()
  totalUnits?: number;

  @IsOptional()
  @IsBoolean()
  smartIntegration?: boolean;
}
