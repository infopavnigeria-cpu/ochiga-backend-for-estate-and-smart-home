// src/auth/dto/auth-response.dto.ts
import { UserRole } from '../../enums/user-role.enum';

export class AuthResponseDto {
  token!: string;
  user!: {
    id: string;
    email: string;
    role: UserRole;
  };
}
