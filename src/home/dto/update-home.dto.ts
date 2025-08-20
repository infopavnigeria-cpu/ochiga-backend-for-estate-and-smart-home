// src/home/dto/create-home.dto.ts
export class CreateHomeDto {
  name!: string;
  address!: string;
}

// src/home/dto/update-home.dto.ts
export class UpdateHomeDto {
  name?: string;
  address?: string;
}