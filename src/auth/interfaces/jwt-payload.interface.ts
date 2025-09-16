import { UserRole } from '../../enums/user-role.enum';

export interface JwtPayload {
  id: string;   // UUID
  email: string;
  role: UserRole;
}
