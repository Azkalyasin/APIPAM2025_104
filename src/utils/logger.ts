import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'development';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      ({ timestamp, level, message, stack }: winston.Logform.TransformableInfo) => {
        if (stack) {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
        }
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      }
    )
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

type LogMessage = string;
type LogMeta = unknown[];

const logger = {
  info: (message: LogMessage, ...meta: LogMeta): void => {
    winstonLogger.info(message, ...meta); // selalu kirim ke winston

    if (!isProduction) {
      console.log('ℹ️  [INFO]:', message, ...meta);
    }
  },

  warn: (message: LogMessage, ...meta: LogMeta): void => {
    winstonLogger.warn(message, ...meta);

    if (!isProduction) {
      console.warn('⚠️  [WARN]:', message, ...meta);
    }
  },

  error: (message: LogMessage, ...meta: LogMeta): void => {
    winstonLogger.error(message, ...meta);

    if (!isProduction) {
      console.error('❌ [ERROR]:', message, ...meta);
    }
  },
};

export default logger;
