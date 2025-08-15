// src/estate/dto/create-estate.dto.ts
export class CreateEstateDto {
  name!: string;
  location!: string;
  size?: number; // optional
}
