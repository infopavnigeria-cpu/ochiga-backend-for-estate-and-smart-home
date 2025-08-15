import { PartialType } from '@nestjs/mapped-types';
import { CreateEstateDto } from './create-estate.dto';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateEstateDto extends PartialType(CreateEstateDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

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
