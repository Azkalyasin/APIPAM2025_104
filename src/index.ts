import app from './app';
import dotenv from 'dotenv';

// load environment variables
dotenv.config();

// simple config object
const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

// simple logger
const logger = {
  info: console.log,
  error: console.error,
};

(async (): Promise<void> => {
  try {
    const server = app.listen(config.port, () => {
      if (config.nodeEnv !== 'production') {
        logger.info(
          `🚀 Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`
        );
      } else {
        logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
      }
    });

    // graceful shutdown
    process.on('SIGTERM', () => server.close());
    process.on('SIGINT', () => server.close());
  } catch (error) {
    logger.error('🚨 Failed to start server:', error);
    process.exit(1);
  }
})();
