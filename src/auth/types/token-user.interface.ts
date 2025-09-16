// src/auth/types/token-user.interface.ts
import { UserRole } from '../../enums/user-role.enum';

export interface TokenUser {
  id: string;
  email: string;
  role: UserRole;
}
