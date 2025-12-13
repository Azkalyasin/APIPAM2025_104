import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400).json({
      success: false,
      message: 'Semua field wajib diisi',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Format email tidak valid',
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      message: 'Password dan konfirmasi password tidak cocok',
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password minimal 6 karakter',
    });
    return;
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      res.status(400).json({
        success: false,
        message: 'Format nomor HP tidak valid (10-15 digit)',
      });
      return;
    }
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Format email tidak valid',
    });
    return;
  }

  next();
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      message: 'Refresh token wajib diisi',
    });
    return;
  }

  next();
};
