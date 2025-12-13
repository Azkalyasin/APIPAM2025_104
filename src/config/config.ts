import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  saltRounds: process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  logLevel: process.env.LOG_LEVEL || 'info',
  enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
};
