import prisma from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput, TokenPayload } from '../types/auth.type';
import { config } from '../config/config';

const JWT_SECRET = config.jwtSecret;
const JWT_REFRESH_SECRET = config.jwtRefreshSecret;
const SALT_ROUNDS = config.saltRounds;

const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (data: RegisterInput) => {
  const { name, email, phone, password, role = 'CUSTOMER' } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password_hash,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      created_at: true,
    },
  });

  if (role === 'CUSTOMER') {
    await prisma.cart.create({
      data: {
        user_id: user.id,
      },
    });
  }

  // convert BigInt id to number for JSON serialization
  const userForResponse = { ...user, id: Number(user.id) };

  const accessToken = generateAccessToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: userForResponse,
    accessToken,
    refreshToken,
  };
};

export const login = async (data: LoginInput) => {
  const { email, password } = data;

  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // REQ-AUTH-005: Validasi credentials
  if (!user) {
    throw new Error('Email atau password salah');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  // Return user tanpa password
  const { password_hash: _password_hash, ...userWithoutPassword } = user;

  // convert BigInt id to number for JSON serialization
  const userWithoutPasswordSafe = {
    ...userWithoutPassword,
    id: Number((userWithoutPassword as any).id),
  };

  return {
    user: userWithoutPasswordSafe,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    return {
      accessToken: newAccessToken,
    };
  } catch (_error) {
    throw new Error('Refresh token tidak valid atau sudah expired');
  }
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (_error) {
    throw new Error('Token tidak valid atau sudah expired');
  }
};

export const getUserById = async (userId: number | string | bigint) => {
  const id = typeof userId === 'bigint' ? Number(userId) : Number(userId);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  // convert any BigInt fields to serializable values
  const safeUser = JSON.parse(
    JSON.stringify(user, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))
  );

  return safeUser;
};
