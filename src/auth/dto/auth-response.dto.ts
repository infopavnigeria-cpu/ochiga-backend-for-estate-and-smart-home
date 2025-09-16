// src/auth/dto/auth-response.dto.ts
import { User } from '../../user/entities/user.entity';

// This strips out the password when sending responses
export type AuthResponseDto = {
  user: Omit<User, 'password'>;
  token: string;
};
