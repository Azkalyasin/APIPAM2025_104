import { UserRole } from '@prisma/client';

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthUserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  created_at: Date;
}

export interface AuthResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}
