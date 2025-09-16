// src/home/dto/create-home.dto.ts
export class CreateHomeDto {
  name!: string;
  address!: string;
  residentId!: string; // ✅ new
}
