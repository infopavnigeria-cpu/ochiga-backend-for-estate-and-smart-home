// src/user/entities/user.entity.ts
export enum UserRole {
  Manager = 'manager',
  Resident = 'resident',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string | null;

  // only needed for residents
  estate?: string;
  house?: string;

  records: any[];
  history: any[];

  inviteToken?: string;
  inviteLink?: string;
}
