import { Request, Response, NextFunction } from 'express';
import * as authService from '../service/auth.service';

// Add this interface at the top
interface AuthRequest extends Request {
  user?: {
    userId: string | number;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest, // Changed from Request to AuthRequest
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu',
      });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = authService.verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah expired',
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Changed to AuthRequest
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized - User tidak ditemukan',
      });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden - Anda tidak memiliki akses ke resource ini',
      });
      return;
    }

    next();
  };
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Changed to AuthRequest
  const userRole = req.user?.role;

  if (userRole !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Forbidden - Hanya admin yang dapat mengakses resource ini',
    });
    return;
  }

  next();
};

export const customerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Changed to AuthRequest
  const userRole = req.user?.role;

  if (userRole !== 'CUSTOMER') {
    res.status(403).json({
      success: false,
      message: 'Forbidden - Hanya customer yang dapat mengakses resource ini',
    });
    return;
  }

  next();
};
