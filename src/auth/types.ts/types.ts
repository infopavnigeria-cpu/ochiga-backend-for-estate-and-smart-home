// src/auth/types.ts
export interface User {
  id: number;
  email: string;
  password: string; // Store hashed password in a real app
}
