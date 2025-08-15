// src/estate/dto/create-estate.dto.ts
export class CreateEstateDto {
  name!: string;
  location!: string;
  description?: string;
  active?: boolean;
  managerName?: string;
  contactNumber?: string;
  totalUnits?: number;
  smartIntegration?: boolean;
}
