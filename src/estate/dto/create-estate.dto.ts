// src/estate/dto/create-estate.dto.ts
import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsInt, 
  Min, 
  MaxLength 
} from 'class-validator';

export class CreateEstateDto {
  @IsString()
  @MaxLength(255)
  name!: string; // Definite assignment assertion

  @IsString()
  @MaxLength(500)
  location!: string; // Definite assignment assertion

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  managerName?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalUnits?: number;

  @IsOptional()
  @IsBoolean()
  smartIntegration?: boolean;
}
