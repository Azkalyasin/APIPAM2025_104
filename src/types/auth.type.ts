import { UserRole } from '@prisma/client';

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
