// src/auth/types.ts
import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  id: string;      // ✅ UUID string
  email: string;
  role: UserRole;
}
