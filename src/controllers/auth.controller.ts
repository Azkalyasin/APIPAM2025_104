import { Request, Response } from 'express';
import * as authService from '../service/auth.service';
import logger from '../utils/logger';

// Add this interface
interface AuthRequest extends Request {
  user?: {
    userId: string | number;
    email: string;
    role: string;
  };
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, phone, password } = req.body;

    const result = await authService.register({
      name,
      email,
      phone,
      password,
      role: 'ADMIN',
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Email sudah terdaftar') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Register error', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Email atau password salah') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Login error', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    logger.error('Refresh token error', error);

    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Refresh token tidak valid',
    });
  }
};

// Changed: req: Request → req: AuthRequest
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await authService.getUserById(userId);

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diambil',
      data: { user },
    });
  } catch (error) {
    logger.error('Get profile error', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil profil',
    });
  }
};

export const logout = (_req: Request, res: Response): Response => {
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil',
  });
};
